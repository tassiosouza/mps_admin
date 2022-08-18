/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMRoute = /* GraphQL */ `
  query GetMRoute($id: ID!) {
    getMRoute(id: $id) {
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
          mealPlan
          status
          customerName
          eta
          routeID
          address
          latitude
          longitude
          orderDate
          phone
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
        status
        latitude
        longitude
        assignedRouteID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      distance
      duration
      location
      routePlanName
      routeDate
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      mRouteDriverId
    }
  }
`;
export const listMRoutes = /* GraphQL */ `
  query ListMRoutes(
    $filter: ModelMRouteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMRoutes(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
            mealPlan
            status
            customerName
            eta
            routeID
            address
            latitude
            longitude
            orderDate
            phone
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
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
          status
          latitude
          longitude
          assignedRouteID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        distance
        duration
        location
        routePlanName
        routeDate
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        mRouteDriverId
      }
      nextToken
      startedAt
    }
  }
`;
export const syncMRoutes = /* GraphQL */ `
  query SyncMRoutes(
    $filter: ModelMRouteFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncMRoutes(
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
            mealPlan
            status
            customerName
            eta
            routeID
            address
            latitude
            longitude
            orderDate
            phone
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
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
          status
          latitude
          longitude
          assignedRouteID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        distance
        duration
        location
        routePlanName
        routeDate
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        mRouteDriverId
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
export const getMOrder = /* GraphQL */ `
  query GetMOrder($id: ID!) {
    getMOrder(id: $id) {
      id
      number
      deliveryInstruction
      mealPlan
      status
      customerName
      eta
      routeID
      address
      latitude
      longitude
      orderDate
      phone
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listMOrders = /* GraphQL */ `
  query ListMOrders(
    $filter: ModelMOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        number
        deliveryInstruction
        mealPlan
        status
        customerName
        eta
        routeID
        address
        latitude
        longitude
        orderDate
        phone
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
export const syncMOrders = /* GraphQL */ `
  query SyncMOrders(
    $filter: ModelMOrderFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncMOrders(
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
        status
        customerName
        eta
        routeID
        address
        latitude
        longitude
        orderDate
        phone
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
      location
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
        location
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
        location
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
      status
      latitude
      longitude
      assignedRouteID
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
        status
        latitude
        longitude
        assignedRouteID
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
        status
        latitude
        longitude
        assignedRouteID
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
