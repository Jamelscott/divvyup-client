function Hr() {
  const height = "1px";
  return (
    <div style={{ width: "100%", height: height }}>
      <hr
        style={{
          color: "red",
          backgroundColor: "#424242",
          height: height,
          marginBottom: "20px",
        }}
      />
    </div>
  );
}

export default Hr;
