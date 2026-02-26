import jwt from 'jsonwebtoken';
import authconfig from '../../config/auth.js';

const authMiddleware = (request, response, next) => {

    const authToken = request.headers.authorization

    if(!authToken) {
        return response.status(401).json({ error: 'Token não fornecido' });
    }
    
    const token = authToken.split(' ')[1];

    try{
        jwt.verify(token, authconfig.secret, (error, decoded) => {
            
            if(error) {
                throw Error();
            }
            // console.log(decoded);
            request.userId = decoded.id;
            request.userName = decoded.name;
            request.userIsAdmin = decoded.admin;
        });
    }catch (_error){
        return response.status(401).json({ error: 'Token inválido' });

}
    return next();

};

export default authMiddleware;