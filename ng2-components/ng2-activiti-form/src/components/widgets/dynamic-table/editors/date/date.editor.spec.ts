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

import { ElementRef } from '@angular/core';
import { DateEditorComponent } from './date.editor';
import { DynamicTableModel, DynamicTableRow, DynamicTableColumn/*, DynamicRowValidationSummary*/ } from './../../../core/index';

describe('DateEditorComponent', () => {

    let nativeElement: any;
    let elementRef: ElementRef;
    let component: DateEditorComponent;
    let row: DynamicTableRow;
    let column: DynamicTableColumn;
    let table: DynamicTableModel;

    beforeEach(() => {
        nativeElement = {
            querySelector: function () { return null; }
        };

        row = <DynamicTableRow> { value: { date: '1879-03-14T00:00:00.000Z' } };
        column = <DynamicTableColumn> { id: 'date', type: 'Date' };
        table = new DynamicTableModel(null);
        table.rows.push(row);
        table.columns.push(column);

        elementRef = new ElementRef(nativeElement);
        component = new DateEditorComponent(elementRef);
        component.table = table;
        component.row = row;
        component.column = column;
    });

    it('should setup date picker on init', () => {
        let trigger = {};
        spyOn(nativeElement, 'querySelector').and.returnValue(trigger);

        component.ngOnInit();

        let settings = component.settings;
        expect(settings.type).toBe('date');
        expect(settings.future.year()).toBe(moment().year() + 21);
        expect(settings.init.isSame(moment('14-03-1879', component.DATE_FORMAT))).toBeTruthy();
        expect(component.datePicker.trigger).toBe(trigger);
    });

    it('should require cell value to setup initial date', () => {
        row.value[column.id] = null;
        component.ngOnInit();
        expect(component.settings.init).toBeUndefined();
    });

    it('should require dom element to setup trigger', () => {
        component = new DateEditorComponent(null);
        component.table = table;
        component.row = row;
        component.column = column;
        component.ngOnInit();
        expect(component.datePicker.trigger).toBeFalsy();
    });

    it('should update fow value on change', () => {
        component.ngOnInit();
        component.datePicker.time = moment('14-03-1879', 'DD-MM-YYYY');
        component.onDateSelected(null);
        expect(row.value[column.id]).toBe('1879-03-14T00:00:00.000Z');
    });

    it('should update material textfield on date selected', () => {
        component.ngOnInit();
        component.datePicker.time = moment('14-03-1879', 'DD-MM-YYYY');
        spyOn(component, 'updateMaterialTextField').and.stub();
        component.onDateSelected(null);
        expect(component.updateMaterialTextField).toHaveBeenCalled();
    });

    it('should require dom element to update material textfield on change', () => {
        component = new DateEditorComponent(null);
        component.table = table;
        component.row = row;
        component.column = column;
        component.ngOnInit();

        component.datePicker.time = moment('14-03-1879', 'DD-MM-YYYY');
        spyOn(component, 'updateMaterialTextField').and.stub();
        component.onDateSelected(null);
        expect(component.updateMaterialTextField).not.toHaveBeenCalled();
    });

    it('should require dom element to update material textfield', () => {
        let result = component.updateMaterialTextField(null, 'value');
        expect(result).toBeFalsy();
    });

    it('should require native dom element to update material textfield', () => {
        elementRef.nativeElement = null;
        let result = component.updateMaterialTextField(elementRef, 'value');
        expect(result).toBeFalsy();
    });

    it('should require input element to update material textfield', () => {
        spyOn(nativeElement, 'querySelector').and.returnValue(null);
        let result = component.updateMaterialTextField(elementRef, 'value');
        expect(result).toBeFalsy();
    });

    it('should update material textfield with new value', () => {
        let called = false;
        const value = '<value>';

        spyOn(nativeElement, 'querySelector').and.returnValue({
            MaterialTextfield: {
                change: function (val) {
                    called = true;
                    expect(val).toBe(value);
                }
            }
        });
        component.updateMaterialTextField(elementRef, value);
        expect(called).toBeTruthy();
    });

});
