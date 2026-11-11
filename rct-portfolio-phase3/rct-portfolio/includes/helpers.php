<?php
/* Small template helpers. Everything printed from config goes through e() or one of these. */

function e($value): string {
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

/* A clearly marked stand-in for content the owner has not supplied yet. */
function ph(string $label): string {
    return '<span class="placeholder">[' . e($label) . ']</span>';
}

/* Escaped value, or a placeholder when empty. */
function or_ph($value, string $label): string {
    $value = trim((string) $value);
    return $value !== '' ? e($value) : ph($label);
}

/* Paragraphs from text (blank line = new paragraph), or one placeholder paragraph. */
function paragraphs($text, string $label): string {
    $parts = preg_split('/\R{2,}/', trim((string) $text), -1, PREG_SPLIT_NO_EMPTY);
    if (!$parts) return '<p>' . ph($label) . '</p>';
    return implode('', array_map(fn ($p) => '<p>' . e(trim($p)) . '</p>', $parts));
}

/* http(s) URLs only. Returns null for empty or unsafe values (javascript:, data:, ...). */
function safe_url($url): ?string {
    $url = trim((string) $url);
    if ($url === '' || !preg_match('#^https?://#i', $url) || !filter_var($url, FILTER_VALIDATE_URL)) return null;
    return $url;
}

function safe_mailto($email): ?string {
    $email = trim((string) $email);
    return filter_var($email, FILTER_VALIDATE_EMAIL) ? 'mailto:' . $email : null;
}

/* Project-relative file that really exists (no '..' allowed). */
function local_file(?string $path): ?string {
    $path = trim((string) $path);
    if ($path === '' || str_contains($path, '..') || preg_match('#^[a-z]+:|^//#i', $path)) return null;
    return is_file(dirname(__DIR__) . '/' . ltrim($path, '/')) ? ltrim($path, '/') : null;
}

/* 'https://github.com/x/' -> 'github.com/x' for display */
function display_url(string $url): string {
    return rtrim(preg_replace('#^https?://(www\.)?#i', '', $url), '/');
}

function icon(string $name): string {
    return '<svg class="icon" aria-hidden="true"><use href="#icon-' . e($name) . '"/></svg>';
}

/* ---- Phase 5 helpers ---------------------------------------------------- */

/* Validated http(s) links for a project: the "links" array plus the legacy single "link". */
function project_links(array $project): array {
    $out = [];
    foreach (($project['links'] ?? []) as $item) {
        $url = safe_url($item['url'] ?? '');
        if ($url) $out[] = ['label' => trim((string) ($item['label'] ?? '')) ?: 'View project', 'url' => $url];
    }
    $legacy = safe_url($project['link'] ?? '');
    if ($legacy && !in_array($legacy, array_column($out, 'url'), true)) {
        array_unshift($out, ['label' => 'View project', 'url' => $legacy]);
    }
    return $out;
}

function project_primary_link(array $project): ?string {
    return project_links($project)[0]['url'] ?? null;
}

/* Normalised view of one project for the cassette archive. Missing values stay empty; templates add placeholders. */
function project_view(array $project, int $number): array {
    $images = [];
    $sources = $project['images'] ?? [];
    if (!empty($project['preview'])) array_unshift($sources, $project['preview']);
    foreach ($sources as $item) {
        $src = local_file(is_array($item) ? ($item['src'] ?? '') : (string) $item);
        if ($src) $images[] = ['src' => $src, 'alt' => is_array($item) && !empty($item['alt']) ? (string) $item['alt'] : ''];
    }
    $title = trim((string) ($project['title'] ?? ''));
    return [
        'number'      => $number,
        'title'       => $title,
        'meta'        => implode(' · ', array_filter([trim((string) ($project['category'] ?? '')), trim((string) ($project['year'] ?? ''))])),
        'description' => trim((string) (($project['description'] ?? '') !== '' ? $project['description'] : ($project['summary'] ?? ''))),
        'tech'        => array_values(array_filter(array_map('trim', array_map('strval', $project['tech'] ?? [])))),
        'images'      => $images,
        'links'       => project_links($project),
        'is_empty'    => $title === '',
    ];
}

/* Contact rows shared by the Contact app and the telephone notebook. */
function contact_rows(array $c): array {
    $rows = [
        ['label' => 'Email',    'href' => safe_mailto($c['email'] ?? ''), 'text' => trim((string) ($c['email'] ?? '')),        'external' => false, 'icon' => 'envelope'],
        ['label' => 'GitHub',   'href' => safe_url($c['github'] ?? ''),   'text' => display_url((string) ($c['github'] ?? '')),   'external' => true,  'icon' => 'code'],
        ['label' => 'Facebook', 'href' => safe_url($c['facebook'] ?? ''), 'text' => display_url((string) ($c['facebook'] ?? '')), 'external' => true,  'icon' => 'link'],
    ];
    $phone = trim((string) ($c['phone'] ?? ''));
    if ($phone !== '') {
        $digits = preg_replace('/[^\d+]/', '', $phone);
        $rows[] = ['label' => 'Phone', 'href' => $digits !== '' ? 'tel:' . $digits : null, 'text' => $phone, 'external' => false, 'icon' => 'link'];
    }
    foreach (($c['others'] ?? []) as $other) {
        $rows[] = ['label' => trim((string) ($other['label'] ?? '')) ?: 'Other', 'href' => safe_url($other['url'] ?? ''), 'text' => display_url((string) ($other['url'] ?? '')), 'external' => true, 'icon' => 'link'];
    }
    if (empty($c['others'])) $rows[] = ['label' => 'Other link', 'href' => null, 'text' => '', 'external' => true, 'icon' => 'link'];
    return $rows;
}
