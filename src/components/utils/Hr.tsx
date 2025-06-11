function Hr(props: React.HTMLAttributes<HTMLHRElement> & { width?: string }) {
  const { width, ...allProps } = props;
  const height = "1px";
  return (
    <div
      style={{
        width: width || "100%",
        height: height,
        margin: props.style?.margin || "20px",
      }}
    >
      <hr
        {...allProps}
        style={{
          color: "red",
          backgroundColor: "#898989",
          height: height,
          opacity: 0.2,
          marginBottom: "20px",
        }}
      />
    </div>
  );
}

export default Hr;
