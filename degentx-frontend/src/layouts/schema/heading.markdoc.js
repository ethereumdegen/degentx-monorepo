import { nodes as markdocNodes } from "@markdoc/markdoc";

function generateID(children, attributes) {
  if (attributes.id && typeof attributes.id === "string") {
    return attributes.id;
  }
  return children
    .filter((child) => typeof child === "string")
    .join(" ")
    .replace(/[?]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

const headingTransform = (node, config) => {
  const base = markdocNodes.heading.transform(node, config);
  base.attributes.id = generateID(base.children, base.attributes);
  return base;
};

export const heading = {
  ...markdocNodes.heading,
  transform: headingTransform,
};
