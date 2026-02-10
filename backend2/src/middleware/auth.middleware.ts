import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
    user?: IUser;
}

interface DecodedToken extends jwt.JwtPayload {
    id: string;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            // Set token from Bearer token in header
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
            req.user = await User.findById(decoded.id) as IUser;
            next();
        } catch (err) {
            return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user?.role}' is not authorized to access this route`
            });
        }
        next();
    };
};
