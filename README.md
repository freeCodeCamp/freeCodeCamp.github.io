# Open Source at freeCodeCamp.org

A beautiful bento-card style showcase of freeCodeCamp's open source projects.

## Features

- Beautiful bento-grid layout with responsive design
- YAML-based configuration for easy project management
- Category filtering (Learning, Tools, Community, Mobile, Resources)
- Animated stats counters
- freeCodeCamp brand colors and styling
- Smooth scroll navigation
- Mobile-friendly design

## Configuration

Projects are configured in `projects.yaml`. Simply edit this file to add, remove, or modify projects:

```yaml
projects:
  - name: Project Name
    description: A brief description of the project
    repo: freeCodeCamp/repo-name
    stars: 1000
    language: TypeScript
    category: learning  # learning, tools, community, mobile, resources
    featured: true      # optional - highlights the card
    size: large         # large, medium, or small
    tags:
      - tag1
      - tag2
```

### Card Sizes

- `large` - Spans 2 columns and 2 rows (for featured projects)
- `medium` - Spans 2 columns
- `small` - Single column (default)

### Categories

- `learning` - Learning platform and curriculum
- `tools` - Developer tools and utilities
- `community` - Community resources and guides
- `mobile` - Mobile applications
- `resources` - Documentation and tutorials

## Local Development

Simply open `index.html` in a browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

## License

This project is open source under the BSD-3-Clause license.
