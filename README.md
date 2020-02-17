# Release process
To generate a CDN file e.g. for hypoconnect-branding.css
1. Create a new release for the repository (e.g. https://github.com/topcompare/home-loans/releases)
2. Trigger a purge of the CDN file (https://cdn.jsdelivr.net/combine/gh/topcompare/home-loans@master/hypoconnect-branding.css): https://purge.jsdelivr.net/combine/gh/topcompare/home-loans@master/hypoconnect-branding.css

Notes: if we work on the same path (here @master), then no further action needed. If we work on versions (e.g. @v2.6.2), then the file gets created as soon as you call it with the cdn.jsdelivr.net/... direct URL. Update the file in the headers in Alfresco seo_fr.properties
