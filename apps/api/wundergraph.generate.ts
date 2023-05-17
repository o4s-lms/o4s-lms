import { configureWunderGraphGeneration } from '@wundergraph/sdk';

export default configureWunderGraphGeneration({
  codeGenerators: [], // abbreviated for brevity
  operationsGeneration: (config) => {
    // include all root fields from the "weather" & "federated" API Namespace
    config.includeNamespaces('countries', 'lms');
    // we could also exclude the root field "me" from the "federated" API Namespace
    //config.filterRootFields(
    //  (field) => field.operationType === 'query' && field.apiNamespace === 'lms' && field.name === 'me'
    //);
  },
});