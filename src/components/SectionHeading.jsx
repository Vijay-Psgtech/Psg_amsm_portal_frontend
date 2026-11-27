export default function SectionHeading({ id, eyebrow, title, sub, as: Tag = 'h2', light = false }) {
  return (
    <div className="section-head">
      {eyebrow ? <p className={'eyebrow' + (light ? ' eyebrow--light' : '')}>{eyebrow}</p> : null}
      <Tag id={id} className="h2">
        {title}
      </Tag>
      {sub ? <p className="sub">{sub}</p> : null}
    </div>
  );
}
