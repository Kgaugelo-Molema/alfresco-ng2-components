/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule, SettingsService, AlfrescoAuthenticationService, StorageService } from 'ng2-alfresco-core';
import { ViewerModule } from 'ng2-alfresco-viewer';

@Component({
    selector: 'alfresco-app-demo',
    template: `
               <label for="ticket"><b>Insert a valid access ticket / ticket:</b></label><br>
               <input id="ticket" type="text" size="48" (change)="updateTicket()" [(ngModel)]="ticket"><br>
               <label for="host"><b>Insert the ip of your Alfresco instance:</b></label><br>
               <input id="host" type="text" size="48" (change)="updateHost()" [(ngModel)]="ecmHost"><br><br>
               <div *ngIf="!authenticated" style="color:#FF2323">
                    Authentication failed to ip {{ ecmHost }} with user: admin, admin, you can still try to add a valid ticket to perform
                    operations.
               </div>
               <hr>

               File node id: <input id="fileNodeId" type="text" [(ngModel)]="fileNodeId">
               <div class="container" *ngIf="authenticated">
                    <alfresco-viewer *ngIf="fileNodeId"
                            [showViewer]="true"
                            [overlayMode]="true"
                            [fileNodeId]="fileNodeId">
                            <div class="mdl-spinner mdl-js-spinner is-active"></div>
                    </alfresco-viewer>
               </div>`
})
class MyDemoApp {

    fileNodeId: string;

    authenticated: boolean;

    ecmHost: string = 'http://127.0.0.1:8080';

    ticket: string;

    constructor(private authService: AlfrescoAuthenticationService,
                private settingsService: SettingsService,
                private storage: StorageService) {
        settingsService.ecmHost = this.ecmHost;
        settingsService.setProviders('ECM');

        if (this.authService.getTicketEcm()) {
            this.ticket = this.authService.getTicketEcm();
        }
    }

    public updateTicket(): void {
        this.storage.setItem('ticket-ECM', this.ticket);
    }

    public updateHost(): void {
        this.settingsService.ecmHost = this.ecmHost;
        this.login();
    }

    ngOnInit() {
        this.login();
    }

    login() {
        this.authService.login('admin', 'admin').subscribe(
            ticket => {
                console.log(ticket);
                this.ticket = this.authService.getTicketEcm();
                this.authenticated = true;
            },
            error => {
                console.log(error);
                this.authenticated = false;
            });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        ViewerModule.forRoot()
    ],
    declarations: [ MyDemoApp ],
    bootstrap:    [ MyDemoApp ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
