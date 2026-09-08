const manejoErrores =(err,req,res,next)=>{
    const codigoEstado = err.statusCode || 500
    const mensaje = err.menssage  || "Error inesperado."
    const fecha = new Date().toISOString()
    console.error(['Fecha', fecha -'Estado:', codigoEstado - 'Mensaje:', mensaje])
    //otra parte de mensaje de error
    if(err.stack){
        console.error(err.stack)
    }
    res.status(codigoEstado).json({Estado: 'error',codigoEstado: codigoEstado, mensaje: mensaje,})
    next()
}
module.exports = manejoErrores