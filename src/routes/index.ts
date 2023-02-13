import { Router } from 'express';

import AuthRoutes from './auth.routes';
import ProductRoutes from './product.routes';
import UserRoutes from './user.routes';
import AddressRoutes from './address.routes';
import ArticlesRoutes from './articles.routes';
import ContactRoutes from './contact.routes';
import ContentRoutes from './content.routes';
import FileRoutes from './file.routes';
import CategoryRoutes from './category.routes';

const routes = Router();

routes.use('/api/v1/users', UserRoutes);
routes.use('/api/v1/auth', AuthRoutes);
routes.use('/api/v1/product', ProductRoutes);
routes.use('/api/v1/address', AddressRoutes);
routes.use('/api/v1/articles', ArticlesRoutes);
routes.use('/api/v1/contact', ContactRoutes);
routes.use('/api/v1/content', ContentRoutes);
routes.use('/api/v1/file', FileRoutes);
routes.use('/api/v1/category', CategoryRoutes);

export default routes;
