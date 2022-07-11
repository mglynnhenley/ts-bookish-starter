import { Router, Request as ExpressRequest, Response } from 'express';
import { resolve } from 'path';
import { Connection, Request as TediousRequest } from 'tedious';

const config = {
    server: 'localhost',
    authentication: {
        type: 'default',
        options: {
            userName: "librarian2",
            password: "booksbooks12!"
        }
    },
    options: {
        port: 1433,
        database: 'bookish',
        trustServerCertificate: true,
        rowCollectionOnRequestCompletion: true
    }
}



class BookController {
    router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/allbooks', this.getBooks.bind(this));
        this.router.get('/:id', this.getBook.bind(this));
        this.router.post('/', this.createBook.bind(this));

    }

    async getBooks(req: ExpressRequest, res: Response): Promise<any> {
        const connection = new Connection(config);


        connection.connect();
        console.log('something else');


        connection.on('connect', async (err) => {
            if (err) {
              console.log('Connection Failed');
              throw err;
            }
            console.log('Connected!!!');
            console.log('\n', '1', '\n')

            //THIS IS REALLY NOT CORRECT

            //let resultPromise = await this.doSomethingAsync('SELECT * from BookCatalogue', connection)
            let result00 = this.executeStatement('SELECT * from BookCatalogue', connection)
                .then((result) => {
                    console.log("result recieved")
                    console.log(result)
                    return res.status(200).json({
                        result: result
                    })
                })
                .catch((error) => {

                });

            
            
            console.log('\n', '6', '\n')
        });
        console.log('\n', '2', '\n')
    }

    private executeStatement(Query: string, connection: Connection) {
        const request = new TediousRequest(Query, (err, rowCount, rows) => {
            if (err) {
                throw err
            } else {
                console.log("request made")
                console.log(rows)
                return rows
            }
        });

        return new Promise((resolve, reject) => {

            let result = [];

            request.on("row", (columns) => {
                columns.forEach((column) => {
                    result.push(column.value);
                    console.log('\n', '3', '\n')
                    console.log(column.value);
                })
            });

            request.on("error", (error) => reject(error));
            request.on("doneProc", () => resolve(result));

            connection.execSql(request);
        })
    }


    getBook(req: ExpressRequest, res: Response) {
        // TODO: implement functionality
        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
    }

    createBook(req: ExpressRequest, res: Response) {
        // TODO: implement functionality
        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
    }
}


export default new BookController().router;
