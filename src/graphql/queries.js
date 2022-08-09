/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMpsRoute = /* GraphQL */ `
  query GetMpsRoute($id: ID!) {
    getMpsRoute(id: $id) {
      id
      cost
      startTime
      endTime
      status
      name
      orders {
        items {
          id
          number
          deliveryInstruction
          mealsInstruction
          status
          customer {
            id
            name
            address
            plan
            phone
            owner
            coordinates {
              id
              latitude
              longitude
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            customerCoordinatesId
          }
          eta
          routeID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          mpOrderCustomerId
        }
        nextToken
        startedAt
      }
      driver {
        id
        name
        email
        phone
        carCapacity
        owner
        onBoard
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      distance
      duration
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      mpsRouteDriverId
    }
  }
`;
export const listMpsRoutes = /* GraphQL */ `
  query ListMpsRoutes(
    $filter: ModelMpsRouteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMpsRoutes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        cost
        startTime
        endTime
        status
        name
        orders {
          items {
            id
            number
            deliveryInstruction
            mealsInstruction
            status
            customer {
              id
              name
              address
              plan
              phone
              owner
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              customerCoordinatesId
            }
            eta
            routeID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            mpOrderCustomerId
          }
          nextToken
          startedAt
        }
        driver {
          id
          name
          email
          phone
          carCapacity
          owner
          onBoard
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        distance
        duration
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        mpsRouteDriverId
      }
      nextToken
      startedAt
    }
  }
`;
export const syncMpsRoutes = /* GraphQL */ `
  query SyncMpsRoutes(
    $filter: ModelMpsRouteFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncMpsRoutes(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        cost
        startTime
        endTime
        status
        name
        orders {
          items {
            id
            number
            deliveryInstruction
            mealsInstruction
            status
            customer {
              id
              name
              address
              plan
              phone
              owner
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              customerCoordinatesId
            }
            eta
            routeID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            mpOrderCustomerId
          }
          nextToken
          startedAt
        }
        driver {
          id
          name
          email
          phone
          carCapacity
          owner
          onBoard
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        distance
        duration
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        mpsRouteDriverId
      }
      nextToken
      startedAt
    }
  }
`;
export const getCoordinates = /* GraphQL */ `
  query GetCoordinates($id: ID!) {
    getCoordinates(id: $id) {
      id
      latitude
      longitude
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listCoordinates = /* GraphQL */ `
  query ListCoordinates(
    $filter: ModelCoordinatesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCoordinates(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        latitude
        longitude
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncCoordinates = /* GraphQL */ `
  query SyncCoordinates(
    $filter: ModelCoordinatesFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCoordinates(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        latitude
        longitude
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getMpOrder = /* GraphQL */ `
  query GetMpOrder($id: ID!) {
    getMpOrder(id: $id) {
      id
      number
      deliveryInstruction
      mealsInstruction
      status
      customer {
        id
        name
        address
        plan
        phone
        owner
        coordinates {
          id
          latitude
          longitude
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        customerCoordinatesId
      }
      eta
      routeID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      mpOrderCustomerId
    }
  }
`;
export const listMpOrders = /* GraphQL */ `
  query ListMpOrders(
    $filter: ModelMpOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMpOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        number
        deliveryInstruction
        mealsInstruction
        status
        customer {
          id
          name
          address
          plan
          phone
          owner
          coordinates {
            id
            latitude
            longitude
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          customerCoordinatesId
        }
        eta
        routeID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        mpOrderCustomerId
      }
      nextToken
      startedAt
    }
  }
`;
export const syncMpOrders = /* GraphQL */ `
  query SyncMpOrders(
    $filter: ModelMpOrderFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncMpOrders(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        number
        deliveryInstruction
        mealsInstruction
        status
        customer {
          id
          name
          address
          plan
          phone
          owner
          coordinates {
            id
            latitude
            longitude
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          customerCoordinatesId
        }
        eta
        routeID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        mpOrderCustomerId
      }
      nextToken
      startedAt
    }
  }
`;
export const getMpsSubscription = /* GraphQL */ `
  query GetMpsSubscription($id: ID!) {
    getMpsSubscription(id: $id) {
      id
      number
      deliveryInstruction
      mealPlan
      subscriptionDate
      address
      status
      name
      email
      phone
      latitude
      longitude
      avatar
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listMpsSubscriptions = /* GraphQL */ `
  query ListMpsSubscriptions(
    $filter: ModelMpsSubscriptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMpsSubscriptions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        number
        deliveryInstruction
        mealPlan
        subscriptionDate
        address
        status
        name
        email
        phone
        latitude
        longitude
        avatar
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncMpsSubscriptions = /* GraphQL */ `
  query SyncMpsSubscriptions(
    $filter: ModelMpsSubscriptionFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncMpsSubscriptions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        number
        deliveryInstruction
        mealPlan
        subscriptionDate
        address
        status
        name
        email
        phone
        latitude
        longitude
        avatar
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getCustomer = /* GraphQL */ `
  query GetCustomer($id: ID!) {
    getCustomer(id: $id) {
      id
      name
      address
      plan
      phone
      owner
      coordinates {
        id
        latitude
        longitude
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      customerCoordinatesId
    }
  }
`;
export const listCustomers = /* GraphQL */ `
  query ListCustomers(
    $filter: ModelCustomerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCustomers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        address
        plan
        phone
        owner
        coordinates {
          id
          latitude
          longitude
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        customerCoordinatesId
      }
      nextToken
      startedAt
    }
  }
`;
export const syncCustomers = /* GraphQL */ `
  query SyncCustomers(
    $filter: ModelCustomerFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCustomers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        address
        plan
        phone
        owner
        coordinates {
          id
          latitude
          longitude
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        customerCoordinatesId
      }
      nextToken
      startedAt
    }
  }
`;
export const getDriver = /* GraphQL */ `
  query GetDriver($id: ID!) {
    getDriver(id: $id) {
      id
      name
      email
      phone
      carCapacity
      owner
      onBoard
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listDrivers = /* GraphQL */ `
  query ListDrivers(
    $filter: ModelDriverFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDrivers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        phone
        carCapacity
        owner
        onBoard
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncDrivers = /* GraphQL */ `
  query SyncDrivers(
    $filter: ModelDriverFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncDrivers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        email
        phone
        carCapacity
        owner
        onBoard
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
      isComplete
      owner
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        isComplete
        owner
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncTodos = /* GraphQL */ `
  query SyncTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncTodos(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        description
        isComplete
        owner
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
