import * as esprima from 'esprima';

// const parseCodeOld = (codeToParse) => {
//     let data = getProgramBody(esprima.parseScript(codeToParse, {loc:true}));
//     return data;
// };

const parseCode = (codeToParse) => {
    let dataJsons = esprima.parseScript(codeToParse, {loc:true});
    let data = parseStatmentArr[dataJsons.type](dataJsons);
    return data;
};



const getProgramBody = (programJson)=>{
    return programJson.body;
};

const getRowElement = (line,type,name,condition,value)=>{
    return {'line':line, 'type':type, 'name':name, 'condition':condition, 'value':value};
};

const parseProgram= (stamentsJsons)=>{
    let programElements=[];
    // let programTable='';
    getProgramBody(stamentsJsons).forEach((x)=>{
        programElements = programElements.concat(parseStatmentArr[x.type](x));
    });
    return programElements;
};

/////////////////////////////////////////////////////////Variable deceleration////////////
const IdentifierInit=(identifierJson)=>{ //used here and in expression
    return identifierJson.name;
};

const literalInit=(literalJson)=>{      //used here and in expression
    return literalJson.value;
};

const arrayInit = (arrayJson)=>{
    let ans = '';
    arrayJson.elements.forEach((x)=>{
        ans = ans + getDeclarationInit[x.type](x)+',';
    });
    ans = ans.substring(0,ans.length - 1);
    return '['+ ans +']';
};

const getMemberValue =(memberJson)=>{
    let name = getRightSideOfAssignment [memberJson.object.type](memberJson.object) + '[' +
        getRightSideOfAssignment [memberJson.property.type](memberJson.property) + ']';
    return name;
};

const getBinaryExpressionValue = (BinaryExpression) =>{ //BinaryExpression
    return '('+getRightSideOfAssignment[BinaryExpression.left.type](BinaryExpression.left) +' '+ BinaryExpression.operator +
        ' ' + getRightSideOfAssignment[BinaryExpression.right.type](BinaryExpression.right)+')';
};

const getDeclarationInit={'Literal':literalInit,'Identifier':IdentifierInit,
    'ArrayExpression':arrayInit,'MemberExpression':getMemberValue,'BinaryExpression':getBinaryExpressionValue};

const parseVariableDeclaration = (varDecJson)=> {
    let ans = [];
    varDecJson.declarations.forEach((x)=>{
        let value = '';
        if (x.init)
            value = getDeclarationInit[x.init.type](x.init);
        ans = ans.concat(getRowElement(varDecJson.loc.start.line,'variable declaration', x.id.name, '',
            value));});
    return ans;
};
///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////Expressions////////////////////////////////

const getMemberExpression =(memberJson)=>{
    let name = getRightSideOfAssignment [memberJson.object.type](memberJson.object) + '[' + getRightSideOfAssignment [memberJson.property.type](memberJson.property) + ']';
    return getRowElement(memberJson.loc.start.line,'member expression',name,'','');
};

const getIdentifierExpression =(identifierJson)=>{
    return getRowElement(identifierJson.loc.start.line,'expression statement',identifierJson.name,'','');
};

const getLiteralExpression =(literalJson)=>{
    return getRowElement(literalJson.loc.start.line,'literal statement','','',literalJson.value);
};

const getAssignment=(AssignmentJson)=>{
    return getRowElement(AssignmentJson.loc.start.line,'assignment statement',
        getRightSideOfAssignment[AssignmentJson.left.type](AssignmentJson.left),'',
        getRightSideOfAssignment[AssignmentJson.right.type](AssignmentJson.right));
};

const getBinaryExpression = (BinaryExpression) =>{ //ExpressionStatement
    return getRowElement(BinaryExpression.loc.start.line,'binary statement',
        '','',getBinaryExpressionValue(BinaryExpression));
};

const getUnaryExpression = (unaryExpression) =>{ //ExpressionStatement
    return getRowElement(unaryExpression.loc.start.line,'unary statement',
        '','',getUnaryExpressionValue(unaryExpression));
};

const getUnaryExpressionValue = (unaryExpression) =>{ //ExpressionStatement
    return '(' +unaryExpression.operator + getRightSideOfAssignment[unaryExpression.argument.type](unaryExpression.argument) + ')';
};

const getUpdateExpression =(updateJson)=>{
    return getRowElement(updateJson.loc.start.line,'update statement','','',
        getUpdateExpressionValue(updateJson));
};

const lintArray = {'ThisExpression':'this','EmptyStatement':[]};


const getThisValue =(updateJson)=>{
    return lintArray[updateJson.type];
};

const getUpdateExpressionValue =(updateJson)=>{
    if (updateJson.prefix)
        return updateJson.operator + getRightSideOfAssignment[updateJson.argument.type](updateJson.argument);
    else
        return getRightSideOfAssignment[updateJson.argument.type](updateJson.argument) + updateJson.operator;
};

const parseSubExpression = {'Identifier':getIdentifierExpression, 'Literal':getLiteralExpression,
    'AssignmentExpression':getAssignment,'MemberExpression':getMemberExpression,
    'BinaryExpression':getBinaryExpression,'UpdateExpression':getUpdateExpression,'UnaryExpression':getUnaryExpression};

const getRightSideOfAssignment = {'Identifier':IdentifierInit,'MemberExpression':getMemberValue,
    'Literal':literalInit,'BinaryExpression':getBinaryExpressionValue,'UpdateExpression':getUpdateExpressionValue,
    'UnaryExpression':getUnaryExpressionValue,'ThisExpression':getThisValue};

const parseExpression=(expressionJson)=>{
    return parseSubExpression[expressionJson.expression.type](expressionJson.expression) ;
};
/////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////while statement////////////////////////////////

const constGetBlockExpressions = (blockStatement)=>{
    let bodyElements = [];
    blockStatement.body.forEach((x)=>{
        bodyElements = bodyElements.concat(parseStatmentArr[x.type](x));
    });
    return bodyElements;
};

const parseWhileStatement = (whileJson) => {
    let testRow = getRowElement(whileJson.loc.start.line,'while statement','',getRightSideOfAssignment[whileJson.test.type](whileJson.test), '');
    let bodyElements = parseStatmentArr[whileJson.body.type](whileJson.body);
    let ans = [];
    ans = ans.concat(testRow);
    ans = ans.concat(bodyElements);
    return ans;
};
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////if statement////////////////////////////////
const parseIfStatement = (ifJson) => {
    return parseKindOfIfStatement (ifJson, 'if statement');
};

const parseKindOfIfStatement = (ifJson, kind) => {
    let testRow = getRowElement(ifJson.loc.start.line,kind,'',
        getRightSideOfAssignment[ifJson.test.type](ifJson.test), '');
    let bodyElements = parseStatmentArr[ifJson.consequent.type](ifJson.consequent);
    let alternateFlow = [];
    if (ifJson.alternate)
        if ( ifJson.alternate.type === 'IfStatement')
            alternateFlow = parseKindOfIfStatement (ifJson.alternate, 'else if statement');
        else
            alternateFlow = parseStatmentArr[ifJson.alternate.type](ifJson.alternate);
    let ans = [];
    ans.push(testRow);
    ans = (ans.concat(bodyElements)).concat(alternateFlow);
    return ans;
};
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////for statement////////////////////////////////
const parseForStatement = (forJson) => {
    let testRow = [];
    if (forJson.test)
        testRow = getRowElement(forJson.loc.start.line,'for statement','',getRightSideOfAssignment[forJson.test.type](forJson.test), '');
    let initRow = [];
    if (forJson.init)
        initRow = parseStatmentArr[forJson.init.type](forJson.init);
    let updateRow = [];
    if (forJson.update)
        updateRow = parseSubExpression[forJson.update.type](forJson.update);
    let bodyElements = parseStatmentArr[forJson.body.type](forJson.body);
    let ans = [];
    ans = ans.concat(testRow);
    ans = ans.concat(initRow);
    ans = ans.concat(updateRow);
    ans = ans.concat(bodyElements);
    return ans;
};
///////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////function statement/////////////////////////////////
const parseFunctionStatement = (functionJson) => {
    let functionRow = getRowElement(functionJson.loc.start.line,'function declaration',functionJson.id.name, '', '');
    let paramsRows = [];
    let bodyRows = parseStatmentArr[functionJson.body.type](functionJson.body);
    functionJson.params.forEach((x)=>{
        paramsRows = paramsRows.concat(parseSubExpression[x.type](x));
    });
    let ans = [];
    ans.push(functionRow);
    ans = ans.concat(paramsRows);
    ans = ans.concat(bodyRows);
    return ans;
};
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
const parseReturnExpression = (returnExpressionJson)=>{
    return getRowElement(returnExpressionJson.loc.start.line,'return expression','', '',
        getRightSideOfAssignment[returnExpressionJson.argument.type](returnExpressionJson.argument));
};
///////////////////////////////////////////////////////////////////////////////////////
const parseEmptyExpression=(emptyExpressionJson)=>{
    return lintArray[emptyExpressionJson.type];
};

const parseStatmentArr= {'VariableDeclaration':parseVariableDeclaration, 'Program':parseProgram,
    'ExpressionStatement':parseExpression,'WhileStatement':parseWhileStatement,'EmptyStatement':parseEmptyExpression,
    'BlockStatement':constGetBlockExpressions,'IfStatement':parseIfStatement,'ForStatement':parseForStatement,
    'FunctionDeclaration':parseFunctionStatement,'ReturnStatement':parseReturnExpression};

export {parseCode};
// export {parseCodeOld};