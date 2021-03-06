import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatPipe'
})
export class ChatPipePipe implements PipeTransform {

  transform(value: any, input: any): any {
    if (input) {
      return value.filter((val: any) => val.Username.toLowerCase().indexOf(input.toLowerCase()) >= 0);
    } else {
      return value;
    }
  }

}
