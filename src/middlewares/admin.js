

const adminMiddleware = (request, response, next) => {

    const isUserAdmin = request.userIsAdmin;

    if(!isUserAdmin) {
        return response.status(401).json({ error: 'Acesso restrito a administradores' });
    }
    
    return next();

};

export default adminMiddleware;