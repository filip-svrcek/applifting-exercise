const PRIORITY = [
  // swagger
  'ApiBearerAuth',
  'ApiBody',
  'ApiConsumes',
  'ApiDeprecated',
  'ApiExtraModels',
  'ApiHeader',
  'ApiHideProperty',
  'ApiOAuth2',
  'ApiOperation',
  'ApiParam',
  'ApiProduces',
  'ApiProperty',
  'ApiPropertyOptional',
  'ApiQuery',
  'ApiResponse',
  'ApiTags',

  // metadata / behavioral
  'Roles',
  'SetMetadata',
  'UseFilters',
  'UseGuards',
  'UseInterceptors',
  'UsePipes',
  'UseValidators',

  // validation - class-validator
  'ArrayMaxSize',
  'ArrayMinSize',
  'ArrayNotEmpty',
  'IsArray',
  'IsBoolean',
  'IsDate',
  'IsDefined',
  'IsEmail',
  'IsEnum',
  'IsInt',
  'IsNotEmpty',
  'IsNumber',
  'IsOptional',
  'IsString',
  'IsUUID',
  'Length',
  'Matches',
  'Max',
  'MaxLength',
  'Min',
  'MinLength',
  'Validate',
  'ValidateNested',

  // class-transformer
  'Exclude',
  'Expose',
  'Transform',
  'Type',

  // nest features
  'HttpCode',
  'Redirect',
  'Render',
  'Version',

  // HTTP methods
  'All',
  'Delete',
  'Get',
  'Head',
  'Options',
  'Patch',
  'Post',
  'Put',
];

function getDecoratorName(decorator) {
  const expr = decorator.expression;
  if (expr.type === 'CallExpression') {
    return expr.callee.name;
  }
  return expr.name;
}

function setDecoratorOrder(node, context) {
  const decorators = node.decorators;
  if (!decorators || decorators.length < 2) return;

  const decoratorNames = decorators.map(getDecoratorName);
  const sortedDecorators = [...decorators].sort((a, b) => {
    const aName = getDecoratorName(a);
    const bName = getDecoratorName(b);
    const aIndex = PRIORITY.indexOf(aName);
    const bIndex = PRIORITY.indexOf(bName);
    return aIndex - bIndex;
  });

  const sortedNames = sortedDecorators.map(getDecoratorName);

  if (JSON.stringify(decoratorNames) !== JSON.stringify(sortedNames)) {
    context.report({
      node,
      message: `Decorators are not in the correct order: expected [${sortedNames.join(', ')}]`,
      fix(fixer) {
        const sourceCode = context.getSourceCode();
        const sortedText = sortedDecorators.map((d) => sourceCode.getText(d)).join('\n');

        const first = decorators[0];
        const last = decorators[decorators.length - 1];

        return fixer.replaceTextRange([first.range[0], last.range[1]], sortedText);
      },
    });
  }
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce method decorator order',
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    function withContext(node) {
      setDecoratorOrder(node, context);
    }
    return {
      MethodDefinition: withContext,
      PropertyDefinition: withContext,
    };
  },
};
