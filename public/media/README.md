# Media assets

Put **original** (non-recreated) media files here so they can be referenced from the site via `/media/...`.

## Logo

Save the logo image you uploaded in chat as:

- `public/media/integratd-living-logo.png`

Then it will be available at:

- `/media/integratd-living-logo.png`

## Hero video

For local development / simplest setup, add:

- `public/media/hero.mp4` (served at `/media/hero.mp4`)

The home hero section is already wired to use it as a full-bleed background video.

### Best practice (recommended for production)

If the video is large (common for premium hero loops), avoid shipping it directly from your Next.js server:

- Use a video hosting/streaming service (best UX): Mux, Cloudflare Stream, Vimeo, Bunny Stream, or an S3/CloudFront style CDN.
- Encode a hero loop as H.264 MP4 (and optionally WebM) and keep the bitrate reasonable.
- Add a lightweight `poster` image so there’s no blank frame while the video buffers.


