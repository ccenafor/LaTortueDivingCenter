# La Tortue Diving Center - Website

Official website for La Tortue Diving Center, a diving resort and accommodation in the Philippines.

## Development Guidelines

### Collaboration Workflow
- Do not create or push git commits unless explicitly requested by the project owner; stage changes only when asked.
- Do not delete branches (local or remote) unless explicitly requested by the project owner.

### Coding Best Practices

All code contributions must follow industry best practices:

- **Clean Code**: Write readable, maintainable, and well-documented code
- **Separation of Concerns**: Keep HTML, CSS, and JavaScript in separate files
- **Semantic HTML**: Use proper HTML5 semantic elements for better structure
- **DRY Principle**: Don't Repeat Yourself - avoid code duplication
- **File Organization**: Keep assets and pages in the correct folders; avoid leaving ungrouped files at the repo root
- **Consistent Naming**: Use clear, descriptive names for classes, IDs, and functions
- **Code Comments**: Document complex logic and functionality
- **Version Control**: Make atomic commits with clear, descriptive messages

### Performance Requirements

Website performance is critical for user experience:

- **Optimize Images**: 
  - Compress all images before uploading
  - Use appropriate formats (WebP for photos, SVG for icons)
  - Implement lazy loading for images below the fold
  - Use responsive images with srcset when appropriate

- **Minimize File Sizes**:
  - Minify CSS and JavaScript for production
  - Remove unused CSS and JavaScript
  - Combine files when possible to reduce HTTP requests

- **Loading Speed**:
  - Aim for <3 second page load time
  - Optimize critical rendering path
  - Use browser caching effectively
  - Defer non-critical JavaScript

- **Mobile Performance**:
  - Ensure fast loading on mobile networks
  - Test on various devices and connection speeds

### SEO Optimization

All pages must be optimized for search engines:

- **Meta Tags**:
  - Include descriptive, unique title tags (50-60 characters)
  - Write compelling meta descriptions (150-160 characters)
  - Add relevant keywords naturally in content
  - Use Open Graph tags for social media sharing

- **Content Structure**:
  - Use proper heading hierarchy (H1, H2, H3)
  - Only one H1 per page
  - Include relevant keywords in headings
  - Write descriptive alt text for all images

- **URL Structure**:
  - Use clean, descriptive URLs
  - Include keywords in URLs when relevant
  - Keep URLs short and readable

- **Technical SEO**:
  - Ensure proper HTML validation
  - Create and maintain sitemap.xml
  - Implement structured data (Schema.org) where applicable
  - Ensure mobile-friendliness
  - Optimize page load speed

- **Content Quality**:
  - Write unique, valuable content
  - Maintain consistent content updates
  - Use internal linking strategically
  - Keep content fresh and relevant

### Code Review Checklist

Before committing changes, ensure:

- [ ] Code follows best practices and style guidelines
- [ ] Images are optimized and compressed
- [ ] Page loads quickly (test in dev tools)
- [ ] Meta tags are present and descriptive
- [ ] Alt text added to all images
- [ ] Heading hierarchy is correct
- [ ] Mobile responsiveness is maintained
- [ ] No duplicate content exists
- [ ] Code is properly commented
- [ ] No console errors in browser
- [ ] Cross-browser compatibility verified

## Project Structure

```
/
├── assets/
│   ├── css/          # Stylesheets
│   ├── js/           # JavaScript files
│   └── images/       # Image assets
├── *.html            # HTML pages
├── new_styles.css    # Main stylesheet
└── README.md         # This file
```

## Getting Started

1. Clone the repository
2. Make changes following the guidelines above
3. Test locally in multiple browsers
4. Commit with descriptive messages
5. Create pull request for review

## Support

For questions or issues, please contact the development team.
