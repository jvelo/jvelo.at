import { Hono } from 'hono';
import { requireAuth } from '../auth';
import { tablesRoute } from './routes/tables';
import { rowsRoute } from './routes/rows';
import { rowDetailRoute, rowUpdateRoute, rowDeleteRoute } from './routes/row-detail';
import { rowCreateRoute, rowInsertRoute } from './routes/row-create';
import { tableConfigRoute, tableConfigUpdateRoute } from './routes/table-config';
import { bulkDeleteRoute } from './routes/bulk-delete';

export const adminApp = new Hono();

adminApp.use('*', requireAuth('admin'));

adminApp.get('/', tablesRoute);
adminApp.get('/:table', rowsRoute);
adminApp.get('/:table/new', rowCreateRoute);
adminApp.post('/:table/new', rowInsertRoute);
adminApp.get('/:table/_config', tableConfigRoute);
adminApp.post('/:table/_config', tableConfigUpdateRoute);
adminApp.post('/:table/_bulk-delete', bulkDeleteRoute);
adminApp.get('/:table/:pk', rowDetailRoute);
adminApp.post('/:table/:pk', rowUpdateRoute);
adminApp.post('/:table/:pk/delete', rowDeleteRoute);
