import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'aeon-message',
  templateUrl: './message.component.html',
  styles: [
    `
      button {
        margin-right: 8px;
      }
    `
  ]
})
export class MessageExComponent {


  constructor(private message: NzMessageService) {}

  createMessage(type: string): void {
    this.message.create(type, `This is a message of ${type}`);
  }

}
