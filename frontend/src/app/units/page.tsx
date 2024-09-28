export default async function Page() {

  const data = [{ id: 1, name: "Empresa 1" }, { id: 2, name: "Empresa 2" }];


  return (
    <>
      <h3>Unidades</h3>
      {data &&
        data.map((item: any) => {
          return (
            <>
              <p>
                <b>Nome:</b> {item.name}
              </p>
              <p>
                <b>id:</b> {item.id}
              </p>
              <p>
                <b>companyId:</b> {item.companyId}
              </p>
              <hr />
            </>
          );
        })}
    </>
  );
}
