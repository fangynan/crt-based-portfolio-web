<?php
/* ==========================================================================
   YOUR CONTENT. Edit only this file to fill in the computer's apps.
   Anything left empty ('' or []) shows as a dashed [placeholder] in the app,
   so nothing here is invented. Cassettes (later phase) will reuse 'projects'.
   Links must start with https:// (or http://); anything else is ignored.
   ========================================================================== */
return [

    'profile' => [
        'name'    => 'Yrrone Ferdinand G. Atilano',
        'photo'   => 'assets/img/profile.jpg',
        'tagline' => "An idiot admires complexity, a genius admires simplicity.",
        'intro'   => 'A Web-Based Portfolio for Event-Driven Subject',
    ],

    'interests' => ['Larping', 'Reading', 'Coding', 'Volunteering'],

    /* Used by About Me (summary) and Resume (full). Most recent first. */
    'education' => [
        [
            'school'  => 'Pamantasan ng Lungsod ng Valenzuela (PLV)',
            'program' => 'Bachelor of Science in Information Technology',
            'period'  => '2023 – Present',
            'details' => '',
        ],
        [
            'school'  => 'Punturin National High School',
            'program' => 'TVL / ICT Strand',
            'period'  => '2021 – 2023',
            'details' => 'With Honors',
        ],
    ],

    'resume' => [
        'summary' => 'Game Developer and Creative Designer focused on UI/UX and interactive systems. Proven ability to optimize asset pipelines and collaborate across technical teams to deliver engaging digital experiences.',
        'experience' => [
            [
                'role'         => 'Junior Multimedia Designer',
                'organization' => '',   // not in the old resume; add it here
                'period'       => '2023 – 2024',
                'highlights'   => ['Collaborated closely with front-end developers to revise and refine interactive elements based on user testing.'],
            ],
            [
                'role'         => 'Graphic Design Intern',
                'organization' => '',   // not in the old resume; add it here
                'period'       => '2022 – 2023',
                'highlights'   => ['Assisted in creating visual assets, storyboards, and conceptual layouts for promotional campaigns and interactive media.'],
            ],
        ],
        'achievements' => [
            ['title' => 'With Honors', 'detail' => 'First Logo Design', 'date' => '2020'],
        ],
    ],

    /* PROJECTS: one entry = one cassette in the archive (entry 1 = top tape) AND one card in the Projects app.
     * Add as many as you like; tapes beyond the 7 on the stack are reached with the player's Next button.
     * Only 'title' is required. Everything else is optional and shows a [placeholder] when empty.
     *
     * [
     *     'title'       => 'Project name',
     *     'category'    => 'Game',                         // small caption on the tape / index card
     *     'year'        => '2025',
     *     'summary'     => 'One sentence (Projects app card).',
     *     'description' => "Longer text for the cassette archive.\n\nBlank line = new paragraph.",
     *     'tech'        => ['C#', 'Unity'],
     *     'images'      => ['assets/img/projects/shot-1.png', ['src' => 'assets/img/projects/shot-2.png', 'alt' => 'Level select']],
     *     'links'       => [['label' => 'Live demo', 'url' => 'https://...'], ['label' => 'Source', 'url' => 'https://...']],
     * ]
     * Older keys still work: 'link' (one URL) and 'preview' (one image). */
    'projects' => [
        [
            'title'       => 'Santi Café Website',
            'category'    => 'Website',
            'summary'     => 'A moody, minimalist website for a neighbourhood café in Valenzuela.',
            'description' => "A website for Santi Café, a calm space in Valenzuela to think, work, and savour. The design leans on a dark, atmospheric look: a full-screen photo hero, big condensed typography, and a clean navigation covering Home, About, Menu, and Contact.\n\nThe goal was to make the site feel like the café itself: quiet, warm, and unhurried.",
            'tech'        => ['JavaScript', 'HTML', 'CSS', 'Supabase'],
            'images'      => [['src' => 'assets/img/projects/santi-cafe.jpg', 'alt' => 'Santi Café homepage with a dark hero photo and the headline SANTI CAFÉ']],
            'links'       => [],
        ],
        [
            'title'       => 'Gungjeon Unlimited',
            'category'    => 'Website',
            'summary'     => 'Website for a Korean-style unlimited samgyupsal restaurant in Valenzuela City.',
            'description' => "The official website for Gungjeon Unlimited, a Korean-style samgyupsal restaurant in Valenzuela City. \"Gungjeon\" means palace, so the site goes for a rich, dark look with warm gold accents and close-up food photography.\n\nIt tells the restaurant's story, shows the menu, lists opening hours (daily, 4 PM to 11 PM), and has a pencil booking page and a table availability button so guests can plan their visit.",
            'tech'        => ['React', 'Node.js', 'TypeScript', 'CSS', 'Supabase', 'Vercel'],
            'images'      => [['src' => 'assets/img/projects/gungjeon-unlimited.jpg', 'alt' => 'Gungjeon Unlimited homepage showing grilled meats and the Our Story section']],
            'links'       => [['label' => 'Visit website', 'url' => 'https://gungjeonunlimited.online']],
        ],
        [
            'title'       => 'Figma Creative Designs',
            'category'    => 'UI / Graphic Design',
            'summary'     => 'A collection of interface and creative design work made in Figma.',
            'description' => "A collection of creative designs made in Figma, from interface screens to graphic layouts. This is where I experiment with layout, typography, colour, and playful ideas before anything becomes code.\n\nThe preview shows an \"About me\" screen concept with a layered, game-menu style layout.",
            'tech'        => ['Figma'],
            'images'      => [['src' => 'assets/img/projects/figma-designs.jpg', 'alt' => 'An About me screen design made in Figma']],
            'links'       => [],
        ],
        [
            'title'       => 'FYnan Portfolio Website',
            'category'    => 'Web Development',
            'year'        => '2025',
            'summary'     => 'My first personal portfolio website, built last year.',
            'description' => "My personal portfolio from last year, and my first full attempt at presenting my work online. It is a dark, card-based layout with a demo reel, an About Me panel, my experience and expertise, and contact and social links, plus pages for credentials and projects.\n\nIt marks where I started in web development, and it is the starting point for the portfolio you are on now.",
            'tech'        => ['HTML', 'CSS', 'JavaScript'],
            'images'      => [['src' => 'assets/img/projects/fynan-portfolio.jpg', 'alt' => 'FYnan portfolio home page with demo reel, about me and contact cards']],
            'links'       => [],
        ],
        [
            'title'       => 'CRT Custom Portfolio Website',
            'category'    => 'Web Development',
            'year'        => '2026',
            'summary'     => 'An interactive retro-desk portfolio built for my Event Driven Programming class.',
            'description' => "The portfolio you are exploring right now, built for my Event Driven Programming class. Every device on the desk is a doorway: the remote powers the TV and computer, the computer opens a working desktop with windows and apps, the cassettes hold my projects, the printer gives out my resume, and the telephone lists how to reach me.\n\nIt is built without frameworks, so the interactions come from plain JavaScript event handling.",
            'tech'        => ['HTML', 'CSS', 'JavaScript', 'PHP'],
            'images'      => [['src' => 'assets/img/projects/crt-portfolio.jpg', 'alt' => 'The retro desk portfolio with a CRT monitor, TV, cassettes, printer and telephone']],
            'links'       => [],
        ],
    ],

    /* STICKY NOTES. Note 1 (pink) = introduction. Note 2 (white) = what you are up to right now.
     * Blank text shows a [placeholder]. Add or remove rows freely. */
    'notes' => [
        'intro' => [
            'heading'  => 'Hello there!',
            'message'  => "Welcome to my desk. Everything here is clickable: switch things on with the remote, flip through the tapes, print my resume, or pick up the phone to get in touch.",
            'sign_off' => 'Thanks for stopping by!',
        ],
        'updates' => [
            'heading' => 'Right now',
            'items'   => [
                ['label' => 'Studying',  'text' => 'BS Information Technology at PLV (2023 – Present)'],
                ['label' => 'Building',  'text' => 'Web-App And Games'],
                ['label' => 'Learning',  'text' => 'Game Development'],
                ['label' => 'Up next',   'text' => 'Secret...'],
            ],
        ],
    ],

    /* Only categories with supplied skills are listed. To add one, copy a line and change the label.
     * Possible additions: 'Frontend', 'Backend', 'Databases', 'Development tools'. No proficiency levels are shown. */
    'skills' => [
        ['label' => 'Programming languages', 'items' => ['C#', 'Java']],
        ['label' => 'Game development',      'items' => ['Game Mechanics', 'Asset Optimization']],
        ['label' => 'UI/UX & design',        'items' => ['UI/UX Architecture', 'Wireframing', 'Typography', 'Branding & Identity', 'Concept Development']],
        ['label' => 'Design software',       'items' => ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'CapCut']],
    ],

    'contact' => [
        'email'    => 'yrroneatilano@gmail.com',
        'phone'    => '',   // optional, e.g. '+63 900 000 0000' (a row appears in the telephone notebook only when filled)
        'github'   => 'https://github.com/fangynan',
        'facebook' => 'https://www.facebook.com/fangynanh',
        'others'   => [
            ['label' => 'Substack', 'url' => 'https://substack.com/@ynann'],
        ],
    ],
];
