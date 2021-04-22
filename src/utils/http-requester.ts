import { objectToHeaders } from ".";
import { HttpError } from "./errors";
import { mockServer } from "./mock.server";

type RequestMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type BodiedRequestMethods = "POST" | "PUT" | "DELETE" | "PATCH";
interface HTTPResponse<T> {
  message: string;
  data?: T;
  meta?: unknown;
}

export class HttpRequester {
  private headers: Headers = new Headers();
  private requestOptions: RequestInit;

  constructor(private baseUrl: string) {
    this.headers.set("accept", "*/*");
    this.headers.set("content-type", "application/json");

    this.requestOptions = {
      headers: this.headers,
      method: "GET",
    };
  }

  private async call<T>(
    url: string,
    method: RequestMethods,
    headers?: Headers,
    body?: any
  ): Promise<HTTPResponse<T>> {
    const requestOptions = { ...this.requestOptions, method };

    if (headers) {
      requestOptions.headers = headers;
    }
    if (body) {
      requestOptions.body =
        typeof body === "object" ? JSON.stringify(body) : String(body);
    }

    const request = await mockServer.fetch(
      `${this.baseUrl}${url}`,
      requestOptions
    ); //await fetch(`${this.baseUrl}${url}`, requestOptions);
    let response;
    try {
      response = await request.json();
    } catch (error) {
      response = await request.json();
    }

    if (request.status >= 400) {
      let message = "An unexpected error occurred";
      if (typeof (response as HTTPResponse<T>).message === "string") {
        message = (response as HTTPResponse<T>).message;
      }

      throw new HttpError(message, request.status);
    }

    return response as HTTPResponse<T>;
  }

  private bodiedRequest<T>(
    url: string,
    method: BodiedRequestMethods,
    body?: any,
    headers?: Record<string, string>
  ): Promise<HTTPResponse<T>> {
    return this.call(url, method, objectToHeaders(headers), body);
  }

  protected setHeader = this.headers.set;

  protected setHeaders(payload: Record<string, string>): void {
    Object.keys(payload).forEach((key) => {
      this.headers.set(key, payload[key]);
    });
  }

  protected getHeader = this.headers.get;

  protected getHeaders(): Record<string, string> {
    const keys: string[] = [];
    const headerKeys = this.headers.keys();
    let key: string;
    while ((key = headerKeys.next().value)) {
      keys.push(key);
    }

    return keys.reduce((acc: Record<string, string>, cur) => {
      acc[cur] = this.headers.get(cur) as string;
      return acc;
    }, {});
  }

  protected get<T>(
    url: string,
    headers?: Record<string, string>
  ): Promise<HTTPResponse<T>> {
    return this.call(url, "GET", objectToHeaders(headers));
  }

  protected post<T>(
    url: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<HTTPResponse<T>> {
    return this.bodiedRequest(url, "POST", body, headers);
  }

  protected put<T>(
    url: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<HTTPResponse<T>> {
    return this.bodiedRequest(url, "PUT", body, headers);
  }

  protected delete<T>(
    url: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<HTTPResponse<T>> {
    return this.bodiedRequest(url, "DELETE", body, headers);
  }

  protected patch<T>(
    url: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<HTTPResponse<T>> {
    return this.bodiedRequest(url, "PATCH", body, headers);
  }
}
