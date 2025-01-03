import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-table-row',
    imports: [CommonModule],
    templateUrl: './row.component.html',
    styleUrl: './row.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RowComponent {

}
