import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';


const selectionSort= '[{"line":1,"type":"function declaration","name":"selectionSort",' +
    '"condition":"","value":""},{"line":1,"type":"expression statement","name":"arr","condition":"","value":""},' +
    '{"line":2,"type":"variable declaration","name":"minIdx","condition":"","value":""},' +
    '{"line":2,"type":"variable declaration","name":"temp","condition":"","value":""},' +
    '{"line":2,"type":"variable declaration","name":"len","condition":"","value":"arr[length]"},' +
    '{"line":4,"type":"for statement","name":"","condition":"(i < len)","value":""},' +
    '{"line":4,"type":"variable declaration","name":"i","condition":"","value":0},' +
    '{"line":4,"type":"update statement","name":"","condition":"","value":"i++"},' +
    '{"line":5,"type":"assignment statement","name":"minIdx","condition":"","value":"i"},' +
    '{"line":6,"type":"for statement","name":"","condition":"(j < len)","value":""},' +
    '{"line":6,"type":"variable declaration","name":"j","condition":"","value":"(i + 1)"},' +
    '{"line":6,"type":"update statement","name":"","condition":"","value":"j++"},{"line":7,"type":"if statement","name":"","condition":"(arr[j] < arr[minIdx])","value":""},{"line":8,"type":"assignment statement","name":"minIdx","condition":"","value":"j"},{"line":11,"type":"assignment statement","name":"temp","condition":"","value":"arr[i]"},{"line":12,"type":"assignment statement","name":"arr[i]","condition":"","value":"arr[minIdx]"},{"line":13,"type":"assignment statement","name":"arr[minIdx]","condition":"","value":"temp"},{"line":15,"type":"return expression","name":"","condition":"","value":"arr"}]';

const insertionSort ='[{"line":1,"type":"function declaration","name":"insertionSort","condition":"","value":""},{"line":1,"type":"expression statement","name":"inputArr","condition":"","value":""},{"line":2,"type":"variable declaration","name":"length","condition":"","value":"inputArr[length]"},{"line":3,"type":"for statement","name":"","condition":"(i < length)","value":""},{"line":3,"type":"variable declaration","name":"i","condition":"","value":1},{"line":3,"type":"update statement","name":"","condition":"","value":"i++"},{"line":4,"type":"variable declaration","name":"key","condition":"","value":"inputArr[i]"},{"line":5,"type":"variable declaration","name":"j","condition":"","value":"(i - 1)"},{"line":6,"type":"while statement","name":"","condition":"(inputArr[j] > key)","value":""},{"line":7,"type":"assignment statement","name":"inputArr[(j + 1)]","condition":"","value":"inputArr[j]"},{"line":8,"type":"assignment statement","name":"j","condition":"","value":"(j - 1)"},{"line":10,"type":"assignment statement","name":"inputArr[(j + 1)]","condition":"","value":"key"},{"line":12,"type":"return expression","name":"","condition":"","value":"inputArr"}]';

const fibonacci='[{"line":1,"type":"function declaration","name":"fibonacci","condition":"","value":""},{"line":1,"type":"expression statement","name":"num","condition":"","value":""},{"line":2,"type":"variable declaration","name":"a","condition":"","value":1},{"line":3,"type":"variable declaration","name":"b","condition":"","value":0},{"line":4,"type":"variable declaration","name":"temp","condition":"","value":""},{"line":6,"type":"while statement","name":"","condition":"(num >= 0)","value":""},{"line":7,"type":"assignment statement","name":"temp","condition":"","value":"a"},{"line":8,"type":"assignment statement","name":"a","condition":"","value":"(a + b)"},{"line":9,"type":"assignment statement","name":"b","condition":"","value":"temp"},{"line":10,"type":"update statement","name":"","condition":"","value":"num--"},{"line":13,"type":"return expression","name":"","condition":"","value":"b"}]';

const binaryIndexOf='[{"line":1,"type":"function declaration","name":"binaryIndexOf","condition":"","value":""},{"line":1,"type":"expression statement","name":"searchElement","condition":"","value":""},{"line":2,"type":"variable declaration","name":"minIndex","condition":"","value":0},{"line":3,"type":"variable declaration","name":"maxIndex","condition":"","value":"(this[length] - 1)"},{"line":4,"type":"variable declaration","name":"currentIndex","condition":"","value":""},{"line":5,"type":"variable declaration","name":"currentElement","condition":"","value":""},{"line":7,"type":"while statement","name":"","condition":"(minIndex <= maxIndex)","value":""},{"line":8,"type":"assignment statement","name":"currentIndex","condition":"","value":"(((minIndex + maxIndex) / 2) | 0)"},{"line":9,"type":"assignment statement","name":"currentElement","condition":"","value":"this[currentIndex]"},{"line":11,"type":"if statement","name":"","condition":"(currentElement < searchElement)","value":""},{"line":12,"type":"assignment statement","name":"minIndex","condition":"","value":"(currentIndex + 1)"},{"line":14,"type":"else if statement","name":"","condition":"(currentElement > searchElement)","value":""},{"line":15,"type":"assignment statement","name":"maxIndex","condition":"","value":"(currentIndex - 1)"},{"line":18,"type":"return expression","name":"","condition":"","value":"currentIndex"},{"line":22,"type":"return expression","name":"","condition":"","value":"(-1)"}]';

const emptyFunction ='[{"line":1,"type":"function declaration","name":"getArrayToTen","condition":"","value":""},{"line":2,"type":"variable declaration","name":"arr","condition":"","value":"[]"},{"line":3,"type":"for statement","name":"","condition":"(i < 20)","value":""},{"line":3,"type":"variable declaration","name":"i","condition":"","value":0},{"line":3,"type":"update statement","name":"","condition":"","value":"i++"},{"line":4,"type":"assignment statement","name":"arr[i]","condition":"","value":"i"},{"line":5,"type":"return expression","name":"","condition":"","value":"arr"}]';

const stamStatement='[{"line":1,"type":"function declaration","name":"stamStatments","condition":"","value":""},{"line":2,"type":"binary statement","name":"","condition":"","value":"(1 + 1)"},{"line":3,"type":"member expression","name":"a[2]","condition":"","value":""},{"line":4,"type":"member expression","name":"a[3][5]","condition":"","value":""},{"line":5,"type":"member expression","name":"b[(3 + 5)]","condition":"","value":""},{"line":6,"type":"assignment statement","name":"x","condition":"","value":"i++"},{"line":7,"type":"assignment statement","name":"t","condition":"","value":"--x"},{"line":8,"type":"expression statement","name":"True","condition":"","value":""},{"line":9,"type":"expression statement","name":"False","condition":"","value":""},{"line":10,"type":"member expression","name":"b[(3 + 5)][3]","condition":"","value":""},{"line":11,"type":"member expression","name":"b[(3 + 5)][3][(5 + x)]","condition":"","value":""}]';

const literalAndUnary='[{"line":1,"type":"function declaration","name":"stamStatments","condition":"","value":""},{"line":2,"type":"unary statement","name":"","condition":"","value":"(-1)"},{"line":3,"type":"variable declaration","name":"s","condition":"","value":"[4,6,3,6,2,1,54]"},{"line":5,"type":"literal statement","name":"","condition":"","value":2},{"line":6,"type":"unary statement","name":"","condition":"","value":"(-1)"},{"line":7,"type":"binary statement","name":"","condition":"","value":"((-1) + 3)"}]';

const findMin='[{"line":1,"type":"function declaration","name":"findMin","condition":"","value":""},{"line":1,"type":"expression statement","name":"arr","condition":"","value":""},{"line":3,"type":"variable declaration","name":"min","condition":"","value":"arr[0]"},{"line":4,"type":"for statement","name":"","condition":"(i < arr[length])","value":""},{"line":4,"type":"variable declaration","name":"i","condition":"","value":1},{"line":4,"type":"update statement","name":"","condition":"","value":"i++"},{"line":5,"type":"if statement","name":"","condition":"(arr[i] < min)","value":""},{"line":6,"type":"assignment statement","name":"min","condition":"","value":"arr[i]"},{"line":7,"type":"return expression","name":"","condition":"","value":"min"}]';

const emptyFor='[{"line":1,"type":"assignment statement","name":"x","condition":"","value":"wow"},{"line":3,"type":"update statement","name":"","condition":"","value":"x++"}]';

const emptyWhile='[{"line":1,"type":"while statement","name":"","condition":1,"value":""}]';



describe('double for', () => {
    it('selectionSort', () => {
        assert.equal(
            JSON.stringify(parseCode('function selectionSort(arr){\n' +
                '  var minIdx, temp, \n' +
                '      len = arr.length;\n' +
                '  for(var i = 0; i < len; i++){\n' +
                '    minIdx = i;\n' +
                '    for(var  j = i+1; j<len; j++){\n' +
                '       if(arr[j]<arr[minIdx]){\n' +
                '          minIdx = j;\n' +
                '       }\n' +
                '    }\n' +
                '    temp = arr[i];\n' + '    arr[i] = arr[minIdx];\n' + '    arr[minIdx] = temp;\n' + '  }\n' +
                '  return arr;\n' +
                '}')),
            selectionSort
        );
    });
});

describe('for+while', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(parseCode('function insertionSort (inputArr) {\n' +
                '    let length = inputArr.length;\n' +
                '    for (let i = 1; i < length; i++) {\n' +
                '        let key = inputArr[i];\n' +
                '        let j = i - 1;\n' +
                '        while (inputArr[j] > key) {\n' +
                '            inputArr[j + 1] = inputArr[j];\n' +
                '            j = j - 1;\n' +
                '        }\n' +
                '        inputArr[j + 1] = key;\n' +
                '    }\n' +
                '    return inputArr;\n' +
                '};')),
            insertionSort
        );
    });
});

describe('while', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(parseCode('function fibonacci(num){\n' +
                '  var a = 1;\n' +
                '  var b = 0;\n' +
                '  var temp;\n' +
                '\n' +
                '  while (num >= 0){\n' +
                '    temp = a;\n' +
                '    a = a + b;\n' +
                '    b = temp;\n' + '    num--;\n' + '  }\n' + '\n' + '  return b;\n' + '}')),
            fibonacci
        );
    });
});

describe('while + declations', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(parseCode('function binaryIndexOf(searchElement) {\n' +
                '    var minIndex = 0;\n' +
                '    var maxIndex = this.length - 1;\n' +
                '    var currentIndex;\n' +
                '    var currentElement;\n' +
                ' \n' +
                '    while (minIndex <= maxIndex) {\n' +
                '        currentIndex = (minIndex + maxIndex) / 2 | 0;\n' +
                '        currentElement = this[currentIndex];\n' +
                ' \n' +
                '        if (currentElement < searchElement) {\n' +
                '            minIndex = currentIndex + 1;\n' + '        }\n' + '        else if (currentElement > searchElement) {\n' + '            maxIndex = currentIndex - 1;\n' + '        }\n' + '        else {\n' + '            return currentIndex;\n' + '        }\n' + '    }\n' + ' \n' + '    return -1;\n' + '}')),
            binaryIndexOf
        );
    });
});

describe('getArrayToTen', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(parseCode('function getArrayToTen(){\n' +
                '  let arr = [];\n' +
                '  for (var i =0;i < 20;i++)\n' +
                '    arr[i]=i;\n' +
                '  return arr;\n' +
                '}')),
            emptyFunction
        );
    });
});

describe('Stam statements alone', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(parseCode('function stamStatments(){\n' +
                '  1+1;\n' +
                '  a[2];\n' +
                '  a[3][5];\n' +
                '  b[3 + 5];\n' + '  x = i++;\n' + '  t = --x;\n' + '  True;\n' + '  False;\n' + '  b[3 + 5][3];\n' + '  b[3 + 5][3][5 + x];\n' +
                '}')),
            stamStatement
        );
    });
});

describe('literal and unary', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(parseCode('function stamStatments(){\n' +
                '-1;\n' +
                'let s = [4,6,3,6,2,1,54];\n' +
                '}\n' +
                '2;\n' +
                '-1;\n' +
                '-1 + 3;')),
            literalAndUnary
        );
    });
});

describe('find min', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(parseCode('function findMin(arr)\n' +
                '{ \n' +
                '  let min = arr[0];\n' +
                '  for (var i=1;i<arr.length;i++)\n' +
                '     if (arr[i]<min)\n' +
                '        min = arr[i];\n' +
                '  return min;\n' +
                '}')),
            findMin
        );
    });
});

describe('empty for', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(parseCode('x ="wow";\n' +
                'for (;;)\n' +
                '   x++;')),
            emptyFor
        );
    });
});

describe('empty while', () => {
    it('', () => {
        assert.equal(
            JSON.stringify(parseCode('while(1);')),
            emptyWhile
        );
    });
});




// describe('For Loop', () => {
//     it('for loop with assignmentExpression update', () => {
//         assert.equal(
//             JSON.stringify(parseCode('function test(){\n' +
//                 'let x = 3;\n' +
//                 'for(i=0;i<=5;i=i+1){\n' +
//                 'x = x+i;\n' +
//                 '}\n' +
//                 'return x;\n' +
//                 '}')),
//             '[{"line":1,"type":"FunctionDeclaration","name":"test","condition":"","value":""},{"line":2,"type":"VariableDeclaration","name":"x","condition":"","value":""},{"line":3,"type":"ForStatement","name":"","condition":"i=0; i<=5; i=i+1","value":""},{"line":4,"type":"AssignmentExpression","name":"x","condition":"","value":"x+i"},{"line":6,"type":"ReturnStatement","name":"","condition":"","value":"x"}]'
//         );
//     });
// });
//
