
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl } = req;
        const userAgent = req.get('user-agent') || '';
        const authHeader = req.get('authorization');

        this.logger.log(
            `${method} ${originalUrl} - ${userAgent} - Auth: ${authHeader ? 'Present' : 'Missing'} - ${authHeader?.substring(0, 20)}...`
        );

        next();
    }
}
