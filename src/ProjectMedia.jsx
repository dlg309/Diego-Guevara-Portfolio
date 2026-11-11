// Keep the editable content paths compatible with Vite and subdirectory hosting.
export const assetHref = (href = '') => href.startsWith('./assets/') ? `./${href.slice('./assets/'.length)}` : href;

export function Arrow({ down = false }) {
  return <span aria-hidden="true" className="arrow">{down ? '↓' : '↗'}</span>;
}

export function TextLink({ href, children, className = 'text-link' }) {
  if (!href) return null;
  return <a className={className} href={assetHref(href)}>{children}<Arrow /></a>;
}

function ProjectImage({ image, eager = false, className = '' }) {
  return <img className={className} src={assetHref(image.src)} alt={image.alt} width={image.width} height={image.height} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" />;
}

function ImageFigure({ image, className = '' }) {
  return (
    <figure className={`image-figure ${className}`}>
      <ProjectImage image={image} />
      <figcaption>{image.caption}{image.fullSize && <> <a href={assetHref(image.src)}>{image.linkLabel || <>Open full image<span className="sr-only">: {image.alt}</span></>}</a></>}</figcaption>
    </figure>
  );
}

export function ProjectMedia({ project, detail = false, eager = false }) {
  const { image, gallery = [] } = project;
  if (!image) return null;
  if (!detail && project.cardMediaNote) {
    return <div className="project-media-note"><span className="eyebrow">{project.mediaLabel || 'PROJECT IN PROGRESS'}</span><p>{project.cardMediaNote}</p><span>Earlier-version screenshots in the case study <span aria-hidden="true">↓</span></span></div>;
  }
  if (!detail) {
    const phones = project.galleryLayout === 'phone';
    return (
      <figure className={`project-media ${phones ? 'project-media--phones' : ''}`}>
        <div className={`media-viewport ${project.previewFit === 'top' ? 'media-viewport--top' : ''}`}>
          {phones ? <div className="phone-pair">{[image, gallery[0]].filter(Boolean).map((item, index) => <ProjectImage key={item.src} image={item} eager={eager && index === 0} />)}</div> : <ProjectImage image={image} eager={eager} />}
        </div>
        <figcaption>{project.cardCaption || image.caption}</figcaption>
      </figure>
    );
  }
  const phones = project.galleryLayout === 'phone';
  const leading = phones ? [image, gallery[0]].filter(Boolean) : [image];
  const additional = phones ? gallery.slice(1) : gallery;
  return (
    <div className="case-media">
      <div className={phones ? 'phone-gallery' : 'screenshot-gallery'}>{leading.map(item => <ImageFigure key={item.src} image={item} />)}</div>
      {additional.length > 0 && <details className="more-screens"><summary>More screenshots<span className="sr-only"> for {project.title}</span><span aria-hidden="true">+</span></summary><div className={phones ? 'phone-gallery' : 'screenshot-gallery'}>{additional.map(item => <ImageFigure key={item.src} image={item} />)}</div></details>}
    </div>
  );
}

