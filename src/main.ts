import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  FORM_ERRORS,
} from '@ngneat/error-tailor';
import {
  CrispyBuilder,
  CrispyDate,
  CrispyDateRange,
  CrispyDiv,
  CrispyEmail,
  CrispyForm,
  CrispyMatFormModule,
  CrispyRow,
  CrispyText,
} from '@smallpearl/crispy-mat-form';
import { AbstractControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CrispyMatFormModule,
    MatButtonModule,
  ],
  providers: [
    {
      // Errors that the form's fields would raise. These errors could
      // be a result of local validators or from server side validation.
      provide: FORM_ERRORS, useValue: {
        required: 'This field is required',
        minlength: (error: { requiredLength: number, actualLength: number }) =>
          `Expected ${error.requiredLength} charactres, but got ${error.actualLength}`,
      },
    },
  ],
  template: `
    <h1>Crispy Forms Demo 2</h1>
    <div>
    Crispy Form demo showing
    <ul>
      <li>A date iput field</li>
      <li>A daterange input field</li>
    </ul>

    </div>
    <form [formGroup]="crispy.form" (ngSubmit)="onSubmit()">
      <crispy-mat-form [crispy]="crispy"></crispy-mat-form>

      <div>
        <button mat-raised-button color="secondary" type="button" (click)="crispy.form.reset()">
          Reset
        </button>&nbsp;
        <button mat-raised-button color="primary" type="submit" [disabled]="crispy.form.invalid">
          Submit
        </button>
      </div>

    </form>
  `,
})
export class App {
  crispy!: CrispyForm;
  constructor(crispyBuilder: CrispyBuilder) {
    /**
     * Check if the end date in date range is within this month. If not
     * set error state in the control. Otherwise, clear the error.
     * @param control
     * @returns
     */
    const endDateRangeValidator = (control: AbstractControl<any, any>) => {
      const endDate = new Date();
      endDate.setTime(Date.parse(control.value));
      const endDateMonth = endDate.getMonth();
      if (!Number.isInteger(endDateMonth) || endDateMonth > new Date().getMonth()) {
        return { invalidDate: true };
      }
      return null;
    };

    this.crispy = crispyBuilder.build(
      CrispyDiv('', [
        CrispyDate('date', new Date()),
        CrispyDateRange(
          'publishedOn',
          {
            beginRangeLabel: 'From',
            endRangeLabel: 'To',
            beginRangeFormControlName: 'published_on__gte',
            endRangeFormControlName: 'published_on__lte',
            endRangeValidators: endDateRangeValidator,
          },
          {
            published_on__gte: '2023-06-19T16:00:00.000Z',
            published_on__lte: '2023-06-25T16:00:00.000Z',
          }
        ),
      ])
    );
  }

  onSubmit() {
    window.alert(
      `Form.value: ${JSON.stringify(this.crispy.form?.value, null, 2)}`
    );
  }
}

bootstrapApplication(App, {
  providers: [
    provideAnimationsAsync(),
  ],
});
