import $ from 'jquery';
import {parseCode} from './code-analyzer';
// import {parseCodeOld} from './code-analyzer';


const createTableRow = (line,type,name,condition, value)=>{
    return '<tr>' + '<td>'+ line + '</td>' + '<td>' + type + '</td>'
        + '<td>' + name + '</td>' +  '<td>' + condition + '</td>' +'<td>' + value + '</td>' +  '</tr>';
};


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        // let parsedCodeOld = parseCodeOld(codeToParse);
        // $('#parsedCode').val(JSON.stringify(parsedCodeOld, null, 2));

        let parsedCode = parseCode(codeToParse);
        let programTable = '';
        parsedCode.forEach((x)=>{
            programTable = programTable + createTableRow(x.line, x.type, x.name, x.condition, x.value);
        });
        $('#parsedCodeT').find('tr:gt(0)').remove();
        $('#parsedCodeT').append(JSON.stringify(programTable, null, 2));

    });
});