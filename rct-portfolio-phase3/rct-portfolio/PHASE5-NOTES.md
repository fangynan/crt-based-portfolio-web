# Phase 5: how to edit content

All content lives in `config/portfolio.php`. Anything left empty shows a dashed [placeholder].

## Add a project (cassette)
Add an entry to `'projects'`. Entry 1 = top tape, entry 7 = bottom tape. Entries 8+ are reached with the player's Next button.
Only `title` is required. Optional: category, year, summary, description (blank line = new paragraph), tech[], images[], links[].
Put images in `assets/img/projects/`. Tape positions on the stack image: `config/cassettes.php`.

## Edit the sticky notes
`'notes' => ['intro' => ...]` (pink) and `['updates' => ...]` (white). Add/remove rows in `updates.items`.

## Add a contact
`'contact'`: email, github, facebook, optional `phone`, and `others` (label + https URL). Used by both the Contact app and the telephone.

## Printer
Put your PDF at `assets/documents/resume.pdf`. Download name and print time: `config/site.php`.
