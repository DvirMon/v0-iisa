import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "daysAgo",
  standalone: true,
})
export class DaysAgoPipe implements PipeTransform {
  transform(dateString: string): number {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
