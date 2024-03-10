import { APIGatewayProxyEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

export class GenericApiController {
    constructor() { }

    async handleRequest(event: APIGatewayProxyEvent): Promise<any> {

        try {
            const { httpMethod, path, body } = event;



        } catch (error) {
            console.error('Error:', error);
            return this.errorResponse(StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    private cors = {
        'Content-Type': 'application/json; charset=utf-8',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
    }

    protected successResponse(data: any, statusCode?: StatusCodes) {
        return {
            statusCode: statusCode ?? StatusCodes.OK,
            body: data ? JSON.stringify(data) : "{}",
            headers: this.cors
        };
    }

    protected errorResponse(statusCode: StatusCodes, message?: string) {
        return {
            statusCode,
            body: JSON.stringify({message: (message ?? GenericApiController.codeToReadable(statusCode)) }),
            headers: this.cors
        };
    }

    public static codeToReadable(statusCode: StatusCodes) {
        return `${GenericApiController.toReadable(StatusCodes[statusCode])} (${statusCode})`;
    }

    public static toReadable = (input: string): string => {
        const words = input.split('_').map(word => word.toLowerCase());
        const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        const result = capitalizedWords.join(' ');
        return result;
    };

    /**
     * Extracting from resource path required position
     * @param eventResource should be event.resource of APIGatewayProxyEvent
     * @param pos integer from 1 to n
     * @returns 
     */
    public static getRootResource(eventResource: string, pos: number = 1): string | undefined {
        let res!: string;
        if (eventResource) {
            const parts = eventResource.replace(/^\/+|\/+$/g, '').split('/');
            if (parts && parts.length > pos - 1) res = parts[pos - 1];
        }
        return res;
    }
}

interface HttpError {
    statusCode: StatusCodes;
    message: string;
}
interface HttpResponse {
    statusCode: StatusCodes;
    resp: any;
}