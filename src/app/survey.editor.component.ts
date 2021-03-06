import {Component, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import * as SurveyKo from 'survey-knockout';
import * as SurveyEditor from 'surveyjs-editor';
import * as widgets from 'surveyjs-widgets';

import 'inputmask/dist/inputmask/phone-codes/phone.js';
import {ArLocale} from './ArLocale';

widgets.icheck(SurveyKo);
widgets.select2(SurveyKo);
widgets.imagepicker(SurveyKo);
widgets.inputmask(SurveyKo);
widgets.jquerybarrating(SurveyKo);
widgets.jqueryuidatepicker(SurveyKo);
widgets.nouislider(SurveyKo);
widgets.select2tagbox(SurveyKo);
widgets.signaturepad(SurveyKo);
widgets.sortablejs(SurveyKo);
widgets.ckeditor(SurveyKo);
widgets.autocomplete(SurveyKo);
widgets.bootstrapslider(SurveyKo);

const CkEditor_ModalEditor = {
  afterRender: function (modalEditor, htmlElement) {
    const editor = window['CKEDITOR'].replace(htmlElement);
    editor.on('change', function () {
      modalEditor.editingValue = editor.getData();
    });
    editor.setData(modalEditor.editingValue);
  },
  destroy: function (modalEditor, htmlElement) {
    const instance = window['CKEDITOR'].instances[htmlElement.id];
    if (instance) {
      instance.removeAllListeners();
      window['CKEDITOR'].remove(instance);
    }
  }
};
SurveyEditor.SurveyPropertyModalEditor.registerCustomWidget(
  'html',
  CkEditor_ModalEditor
);


@Component({
  selector: 'survey-editor',
  template: `<div id="surveyEditorContainer" [class]="rtl ? 'rtlSurvey' : ''"></div>`,
  styleUrls: ['./survey.editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SurveyEditorComponent {
  editor: SurveyEditor.SurveyEditor;
  @Input() json: any;
  @Input() language: String = 'en';
  @Input() rtl: Boolean = false;
  @Output() surveySaved: EventEmitter<Object> = new EventEmitter();

  ngOnInit() {
    // SurveyKo.JsonObject.metaData.addProperty(
    //   'questionbase',
    //   'popupdescription:text'
    // );
    // SurveyKo.JsonObject.metaData.addProperty('page', 'popupdescription:text');

    SurveyEditor.editorLocalization.locales['ar'] = ArLocale;
    SurveyEditor.editorLocalization.currentLocale = 'ar';
    const editorOptions = {showEmbededSurveyTab: false, generateValidJSON: true};
    this.editor = new SurveyEditor.SurveyEditor(
      'surveyEditorContainer',
      editorOptions
    );

    this.editor.text = JSON.stringify(this.json);
    this.editor.saveSurveyFunc = this.saveMySurvey;
  }

  saveMySurvey = () => {
    console.log(this.editor.text);
    this.surveySaved.emit(JSON.parse(this.editor.text));
  }
}
