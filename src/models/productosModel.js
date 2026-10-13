//importar la conexion a bd
//pára el ejemplo msimularemos una bd

    const datos = [
        { "id": 1, "nombre": "Laptop de segunda", "precio": 1200000 },
        { "id": 2, "nombre": "Mouse inalámbrico", "precio": 45000 }
    ];
 const listarProductos = async () => {
    //consulta a bd await
    return datos;
};

module.exports = {listarProductos};