import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duedate'
})
export class DuedatePipe implements PipeTransform {

  transform(value: string | Date): string {
    if (!value) return '-';

    const targetDate = new Date(value);
    const today = new Date();

    // Set time to 0 to compare only dates
    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffMs = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
    } else if (diffDays < 0) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} overdue`;
    } else {
      return 'Today';
    }
  }

}
