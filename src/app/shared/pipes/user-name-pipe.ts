import { Pipe, PipeTransform } from '@angular/core';
import { Users } from '../../core/models/user.model';


@Pipe({
  name: 'userName'
})
export class UserNamePipe implements PipeTransform {

  transform(value: unknown, users: Users[]): string {

    const user = users.find(u => u.id == value);
    if(user) {
      return user.fullName;
    }
    return '-';
  }

}
