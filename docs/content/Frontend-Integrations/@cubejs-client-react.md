---
title: '@cubejs-client/react'
permalink: /@cubejs-client-react
category: Frontend Integrations
subCategory: Reference
menuOrder: 3
---

`@cubejs-client/react` provides React Components for easy Cube.js integration in a React app.

## useCubeQuery

>  **useCubeQuery**‹**TData**›(**query**: Query | Query[], **options?**: [UseCubeQueryOptions](#use-cube-query-use-cube-query-options)): *[UseCubeQueryResult](#use-cube-query-use-cube-query-result)‹TData›*

A React hook for executing Cube.js queries
```js
import React from 'react';
import { Table } from 'antd';
import { useCubeQuery }  from '@cubejs-client/react';

export default function App() {
  const { resultSet, isLoading, error, progress } = useCubeQuery({
    measures: ['Orders.count'],
    dimensions: ['Orders.createdAt.month'],
  });

  if (isLoading) {
    return <div>{progress && progress.stage && progress.stage.stage || 'Loading...'}</div>;
  }

  if (error) {
    return <div>{error.toString()}</div>;
  }

  if (!resultSet) {
    return null;
  }

  const dataSource = resultSet.tablePivot();
  const columns = resultSet.tableColumns();

  return <Table columns={columns} dataSource={dataSource} />;
}

```

**Type parameters:**

- **TData**

### UseCubeQueryOptions

Name | Type | Description |
------ | ------ | ------ |
cubejsApi? | CubejsApi | A `CubejsApi` instance to use. Taken from the context if the param is not passed |
resetResultSetOnChange? | boolean | When `true` the resultSet will be reset to `null` first |
skip? | boolean | Query execution will be skipped when `skip` is set to `true`. You can use this flag to avoid sending incomplete queries. |
subscribe? | boolean | Use continuous fetch behavior. See [Real-Time Data Fetch](real-time-data-fetch) |

### UseCubeQueryResult

Name | Type |
------ | ------ |
error | Error &#124; null |
isLoading | boolean |
progress | ProgressResponse |
refetch |  () => *Promise‹void›* |
resultSet | ResultSet‹TData› &#124; null |

## isQueryPresent

>  **isQueryPresent**(**query**: Query | Query[]): *boolean*

Checks whether the query is ready

## useCubeMeta

>  **useCubeMeta**(**options?**: Omit‹CubeFetchOptions, "query"›): *CubeFetchResult‹Meta›*

## QueryBuilder

> **QueryBuilder** extends **React.Component** ‹[QueryBuilderProps](#query-builder-query-builder-props), [QueryBuilderState](#query-builder-query-builder-state)›:

`<QueryBuilder />` is used to build interactive analytics query builders. It abstracts state management and API calls to Cube.js Backend. It uses render prop technique and doesn’t render anything itself, but calls the render function instead.

**Example**

[Open in CodeSandbox](https://codesandbox.io/s/z6r7qj8wm)
```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Divider, Empty, Select } from 'antd';
import { QueryBuilder } from '@cubejs-client/react';
import cubejs from '@cubejs-client/core';
import 'antd/dist/antd.css';

import ChartRenderer from './ChartRenderer';

const cubejsApi = cubejs('YOUR-CUBEJS-API-TOKEN', {
  apiUrl: 'http://localhost:4000/cubejs-api/v1',
});

const App = () => (
  <QueryBuilder
    query={{
      timeDimensions: [
        {
          dimension: 'LineItems.createdAt',
          granularity: 'month',
        },
      ],
    }}
    cubejsApi={cubejsApi}
    render={({ resultSet, measures, availableMeasures, updateMeasures }) => (
      <Layout.Content style={{ padding: '20px' }}>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Please select"
          onSelect={(measure) => updateMeasures.add(measure)}
          onDeselect={(measure) => updateMeasures.remove(measure)}
        >
          {availableMeasures.map((measure) => (
            <Select.Option key={measure.name} value={measure}>
              {measure.title}
            </Select.Option>
          ))}
        </Select>
        <Divider />
        {measures.length > 0 ? (
          <ChartRenderer resultSet={resultSet} />
        ) : (
          <Empty description="Select measure or dimension to get started" />
        )}
      </Layout.Content>
    )}
  />
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

### QueryBuilderProps

Name | Type | Description |
------ | ------ | ------ |
cubejsApi? | CubejsApi | `CubejsApi` instance to use |
defaultChartType? | [ChartType](#types-chart-type) | - |
defaultQuery? | Query | Default query (used when initialVizState is not set or does not contain query) |
disableHeuristics? | boolean | Defaults to `false`. This means that the default heuristics will be applied. For example: when the query is empty and you select a measure that has a default time dimension it will be pushed to the query. |
initialVizState? | [VizState](#types-viz-state) | State for the QueryBuilder to start with. Pass in the value previously saved from onVizStateChanged to restore a session. |
onVizStateChanged? |  (**vizState**: [VizState](#types-viz-state)) => *void* | Called by the `QueryBuilder` when the viz state has changed. Use it to save state outside of the `QueryBuilder` component. |
render |  (**renderProps**: [QueryBuilderRenderProps](#query-builder-query-builder-render-props)) => *React.ReactNode* | - |
stateChangeHeuristics? |  (**state**: [QueryBuilderState](#query-builder-query-builder-state), **newState**: [QueryBuilderState](#query-builder-query-builder-state)) => *[QueryBuilderState](#query-builder-query-builder-state)* | A function that accepts the `newState` just before it's applied. You can use it to override the **defaultHeuristics** or to tweak the query or the vizState in any way. |
wrapWithQueryRenderer? | boolean | - |

### QueryBuilderRenderProps

Name | Type | Description |
------ | ------ | ------ |
availableDimensions | TCubeDimension[] | An array of available dimensions to select. They are loaded via the API from Cube.js Backend. |
availableFilterMembers | Array‹[AvailableCube](#types-available-cube)‹TCubeMeasure› &#124; [AvailableCube](#types-available-cube)‹TCubeDimension›› | - |
availableMeasures | TCubeMeasure[] | An array of available measures to select. They are loaded via the API from Cube.js Backend. |
availableMembers | [AvailableMembers](#types-available-members) | - |
availableSegments | TCubeSegment[] | An array of available segments to select. They are loaded via the API from Cube.js Backend. |
availableTimeDimensions | TCubeDimension[] | An array of available time dimensions to select. They are loaded via the API from Cube.js Backend. |
chartType? | [ChartType](#types-chart-type) | Selected chart type |
dimensions | object & object & object[] | - |
dryRunResponse? | DryRunResponse | - |
error? | Error &#124; null | - |
filters | object & object & object[] | - |
isFetchingMeta | boolean | - |
isQueryPresent | boolean | Indicates whether the query is ready to be displayed or not |
loadingState? | [TLoadingState](#types-t-loading-state) | - |
measures | object & object & object[] | - |
meta | Meta &#124; undefined | - |
metaError? | Error &#124; null | - |
missingMembers | string[] | - |
orderMembers | TOrderMember[] | All possible order members for the query |
pivotConfig? | PivotConfig | See [Pivot Config](@cubejs-client-core#types-pivot-config) |
query | Query | - |
refresh |  () => *void* | - |
resultSet? | ResultSet &#124; null | - |
segments | object & object[] | - |
timeDimensions | object & object & object[] | - |
updateChartType |  (**chartType**: [ChartType](#types-chart-type)) => *void* | Used for chart type update |
updateDimensions | [DimensionUpdater](#types-dimension-updater) | - |
updateFilters | [FilterUpdater](#types-filter-updater) | - |
updateMeasures | [MeasureUpdater](#types-measure-updater) | - |
updateOrder | [OrderUpdater](#types-order-updater) | Used for query order update |
updatePivotConfig | [PivotConfigUpdater](#types-pivot-config-updater) | Helper method for `pivotConfig` updates |
updateQuery |  (**query**: Query) => *void* | Used for partial of full query update |
updateSegments | [SegmentUpdater](#types-segment-updater) | - |
updateTimeDimensions | [TimeDimensionUpdater](#types-time-dimension-updater) | - |
validatedQuery | Query | - |

### QueryBuilderState

> **QueryBuilderState**: *[VizState](#types-viz-state) & object*

## QueryRenderer

> **QueryRenderer** extends **React.Component** ‹[QueryRendererProps](#query-renderer-query-renderer-props)›:

`<QueryRenderer />` a react component that accepts a query, fetches the given query, and uses the render prop to render the resulting data

### QueryRendererProps

Name | Type | Description |
------ | ------ | ------ |
cubejsApi? | CubejsApi | `CubejsApi` instance to use |
loadSql? | "only" &#124; boolean | Indicates whether the generated by `Cube.js` SQL Code should be requested. See [rest-api#sql](rest-api#api-reference-v-1-sql). When set to `only` then only the request to [/v1/sql](rest-api#api-reference-v-1-sql) will be performed. When set to `true` the sql request will be performed along with the query request. Will not be performed if set to `false` |
queries? | object | - |
query | Query &#124; Query[] | Analytic query. [Learn more about it's format](query-format) |
render |  (**renderProps**: [QueryRendererRenderProps](#query-renderer-query-renderer-render-props)) => *void* | Output of this function will be rendered by the `QueryRenderer` |
resetResultSetOnChange? | boolean | When `true` the **resultSet** will be reset to `null` first on every state change |
updateOnlyOnStateChange? | boolean | - |

### QueryRendererRenderProps

Name | Type |
------ | ------ |
error | Error &#124; null |
loadingState | [TLoadingState](#types-t-loading-state) |
resultSet | ResultSet &#124; null |
sqlQuery | SqlQuery &#124; null |

## CubeProvider

> **CubeProvider**: *React.FC‹[CubeProviderProps](#types-cube-provider-props)›*

Cube.js context provider
```js
import React from 'react';
import cubejs from '@cubejs-client/core';
import { CubeProvider } from '@cubejs-client/react';

const API_URL = 'https://harsh-eel.aws-us-east-2.cubecloudapp.dev';
const CUBEJS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.* eyJpYXQiOjE1OTE3MDcxNDgsImV4cCI6MTU5NDI5OTE0OH0.* n5jGLQJ14igg6_Hri_Autx9qOIzVqp4oYxmX27V-4T4';

const cubejsApi = cubejs(CUBEJS_TOKEN, {
  apiUrl: `${API_URL}/cubejs-api/v1`,
});

export default function App() {
  return (
    <CubeProvider cubejsApi={cubejsApi}>
      //...
    </CubeProvider>
  )
}
```

## CubeContext

> **CubeContext**: *Context‹[CubeContextProps](#types-cube-context-props)›*

In case when you need direct access to `cubejsApi` you can use `CubeContext` anywhere in your app

```js
import React from 'react';
import { CubeContext } from '@cubejs-client/react';

export default function DisplayComponent() {
  const { cubejsApi } = React.useContext(CubeContext);
  const [rawResults, setRawResults] = React.useState([]);
  const query = {
    ...
  };

  React.useEffect(() => {
    cubejsApi.load(query).then((resultSet) => {
      setRawResults(resultSet.rawData());
    });
  }, [query]);

  return (
    <>
      {rawResults.map(row => (
        ...
      ))}
    </>
  )
}
```

## Types

### AvailableCube

Name | Type |
------ | ------ |
cubeName | string |
cubeTitle | string |
members | T[] |

### AvailableMembers

Name | Type |
------ | ------ |
dimensions | [AvailableCube](#types-available-cube)‹TCubeDimension›[] |
measures | [AvailableCube](#types-available-cube)‹TCubeMeasure›[] |
segments | [AvailableCube](#types-available-cube)‹TCubeSegment›[] |
timeDimensions | [AvailableCube](#types-available-cube)‹TCubeDimension›[] |

### ChartType

> **ChartType**: *"line" | "bar" | "table" | "area" | "number" | "pie"*

### CubeContextProps

Name | Type |
------ | ------ |
cubejsApi | CubejsApi |

### CubeProviderProps

Name | Type |
------ | ------ |
children | React.ReactNode |
cubejsApi | CubejsApi &#124; null |

### DimensionUpdater

> **DimensionUpdater**: *[MemberUpdater](#types-member-updater)‹TCubeDimension›*

### FilterExtraFields

Name | Type |
------ | ------ |
dimension | TCubeDimension &#124; TCubeMeasure |
operators | object[] |

### FilterUpdateFields

Name | Type |
------ | ------ |
dimension | TCubeDimension &#124; TCubeMeasure |
member? | string |
operator | BinaryOperator &#124; UnaryOperator |
values? | string[] |

### FilterUpdater

> **FilterUpdater**: *[MemberUpdater](#types-member-updater)‹[FilterUpdateFields](#types-filter-update-fields)›*

### FilterWithExtraFields

> **FilterWithExtraFields**: *Omit‹Filter, "dimension"› & [FilterExtraFields](#types-filter-extra-fields)*

### GranularityOptions

Name | Type |
------ | ------ |
granularities | object[] |

### MeasureUpdater

> **MeasureUpdater**: *[MemberUpdater](#types-member-updater)‹TCubeMeasure›*

### MemberUpdater

You can use the following methods for member manipulaltion
```js
<QueryBuilder
  // ...
  cubejsApi={cubejsApi}
  render={({
    // ...
    availableMeasures,
    updateMeasures,
  }) => {
    return (
      // ...
      <Select
        mode="multiple"
        placeholder="Please select"
        onSelect={(measure) => updateMeasures.add(measure)}
        onDeselect={(measure) => updateMeasures.remove(measure)}
      >
        {availableMeasures.map((measure) => (
          <Select.Option key={measure.name} value={measure}>
            {measure.title}
          </Select.Option>
        ))}
      </Select>
    );
  }}
/>
```

NOTE: if you need to add or remove more than one member at a time you should use `updateQuery` prop of [QueryBuilderRenderProps](#query-builder-query-builder-render-props)
```js
<QueryBuilder
  // ...
  cubejsApi={cubejsApi}
  render={({
    // ...
    measures,
    updateMeasures,
    updateQuery,
  }) => {
    // ...
    return (
      <>
        // WRONG: This code will not work properly
        <button
          onClick={() =>
            measures.forEach((measure) => updateMeasures.remove(measure))
          }
        >
          Remove all
        </button>

        // CORRECT: Using `updateQuery` for removing all measures
        <button
          onClick={() =>
            updateQuery({
              measures: [],
            })
          }
        >
          Remove all
        </button>
      </>
    );
  }}
/>
```

Name | Type |
------ | ------ |
add |  (**member**: T) => *void* |
remove |  (**member**: object) => *void* |
update |  (**member**: object, **updateWith**: T) => *void* |

### OrderUpdater

Name | Type |
------ | ------ |
reorder |  (**sourceIndex**: number, **destinationIndex**: number) => *void* |
set |  (**memberId**: string, **order**: QueryOrder &#124; "none") => *void* |
update |  (**order**: Query["order"]) => *void* |

### PivotConfigExtraUpdateFields

Name | Type |
------ | ------ |
limit? | number |

### PivotConfigUpdater

Name | Type |
------ | ------ |
moveItem |  (**args**: [PivotConfigUpdaterArgs](#types-pivot-config-updater-args)) => *void* |
update |  (**pivotConfig**: PivotConfig & [PivotConfigExtraUpdateFields](#types-pivot-config-extra-update-fields)) => *void* |

### PivotConfigUpdaterArgs

Name | Type |
------ | ------ |
destinationAxis | TSourceAxis |
destinationIndex | number |
sourceAxis | TSourceAxis |
sourceIndex | number |

### SegmentUpdater

> **SegmentUpdater**: *[MemberUpdater](#types-member-updater)‹TCubeSegment›*

### TLoadingState

Name | Type |
------ | ------ |
isLoading | boolean |

### TimeDimensionComparisonUpdateFields

Name | Type |
------ | ------ |
compareDateRange | Array‹DateRange› |
dimension | TCubeDimension |
granularity? | TimeDimensionGranularity |

### TimeDimensionExtraFields

Name | Type |
------ | ------ |
dimension | TCubeDimension & [GranularityOptions](#types-granularity-options) |

### TimeDimensionRangedUpdateFields

Name | Type |
------ | ------ |
dateRange? | DateRange |
dimension | TCubeDimension |
granularity? | TimeDimensionGranularity |

### TimeDimensionUpdater

> **TimeDimensionUpdater**: *[MemberUpdater](#types-member-updater)‹[TimeDimensionRangedUpdateFields](#types-time-dimension-ranged-update-fields) | [TimeDimensionComparisonUpdateFields](#types-time-dimension-comparison-update-fields)›*

### TimeDimensionWithExtraFields

> **TimeDimensionWithExtraFields**: *Omit‹TimeDimension, "dimension"› & [TimeDimensionExtraFields](#types-time-dimension-extra-fields)*

### VizState

Name | Type |
------ | ------ |
chartType? | [ChartType](#types-chart-type) |
pivotConfig? | PivotConfig |
query? | Query |
