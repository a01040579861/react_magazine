import React from "react";
import styled from "styled-components";

const Image = (props) => {
  const { shape, src, size, row } = props;
  const styles = { src, size };
  const outerStyle = { row };
  if (shape === "circle") {
    return <ImageCircle {...styles}></ImageCircle>;
  }
  if (shape === "rectangle") {
    return (
      <AspectOutter {...outerStyle}>
        <AspectInner {...styles} />
      </AspectOutter>
    );
  }
  return (
    <>
      <ImageDefault {...styles}></ImageDefault>
    </>
  );
};

const ImageDefault = styled.div`
  --size: ${(props) => props.size}px;
  width: var(--size);
  height: var(--size);
  background-image: url("${(props) => props.src}");
  background-size: cover;
`;

const ImageCircle = styled.div`
  --size: ${(props) => props.size}px;
  width: var(--size);
  height: var(--size);
  border-radius: var(--size);
  background-image: url("${(props) => props.src}");
  background-size: cover;
  margin: 4px;
`;

const AspectOutter = styled.div`
  /* width: 100%; */
  ${(props) => (props.row ? "width: 300px;" : "width: 100%;")}

  min-width: 200px;
`;

const AspectInner = styled.div`
  position: relative;
  padding-top: 75%;
  overflow: hidden;
  background-image: url("${(props) => props.src}");
  background-size: cover;
`;

Image.defaultProps = {
  shape: "circle",
  src: "https://audition.hanbiton.com/images/common/img_default.jpg",
  size: 36,
};

export default Image;
