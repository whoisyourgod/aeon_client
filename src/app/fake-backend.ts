import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.includes('/courses') && method === 'GET':
                    return getAllCourses();
                case url.includes('/courses') && method === 'POST':
                    return getAllCourses();
                case url.includes('/courses') && method === 'DELETE':
                    return getAllCourses();
                case url.includes('/courses') && method === 'PUT':
                    return getAllCourses();
                default:
                    return next.handle(request);
            }
        }

        function getAllCourses() {
            return ok([{
                id: "01",
                name: "A",
                description: "AAAA"
            },
            {
                id: "02",
                name: "B",
                description: "BBBB"
            }]);
        }

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }));
        }
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
