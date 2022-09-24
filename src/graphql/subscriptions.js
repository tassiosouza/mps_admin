/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMRoute = /* GraphQL */ `
  subscription OnCreateMRoute {
    onCreateMRoute {
      id
      cost
      startTime
      endTime
      status
      driverID
      distance
      duration
      location
      routePlanName
      routeDate
      points
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateMRoute = /* GraphQL */ `
  subscription OnUpdateMRoute {
    onUpdateMRoute {
      id
      cost
      startTime
      endTime
      status
      driverID
      distance
      duration
      location
      routePlanName
      routeDate
      points
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteMRoute = /* GraphQL */ `
  subscription OnDeleteMRoute {
    onDeleteMRoute {
      id
      cost
      startTime
      endTime
      status
      driverID
      distance
      duration
      location
      routePlanName
      routeDate
      points
      createdAt
      updatedAt
    }
  }
`;
export const onCreateMOrder = /* GraphQL */ `
  subscription OnCreateMOrder {
    onCreateMOrder {
      id
      number
      deliveryInstruction
      mealPlan
      status
      customerName
      eta
      assignedRouteID
      address
      latitude
      longitude
      orderDate
      phone
      location
      sort
      avatar
      subscriptionID
      subscriptionNumber
      deliveryKey
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateMOrder = /* GraphQL */ `
  subscription OnUpdateMOrder {
    onUpdateMOrder {
      id
      number
      deliveryInstruction
      mealPlan
      status
      customerName
      eta
      assignedRouteID
      address
      latitude
      longitude
      orderDate
      phone
      location
      sort
      avatar
      subscriptionID
      subscriptionNumber
      deliveryKey
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteMOrder = /* GraphQL */ `
  subscription OnDeleteMOrder {
    onDeleteMOrder {
      id
      number
      deliveryInstruction
      mealPlan
      status
      customerName
      eta
      assignedRouteID
      address
      latitude
      longitude
      orderDate
      phone
      location
      sort
      avatar
      subscriptionID
      subscriptionNumber
      deliveryKey
      createdAt
      updatedAt
    }
  }
`;
export const onCreateMpsSubscription = /* GraphQL */ `
  subscription OnCreateMpsSubscription {
    onCreateMpsSubscription {
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
      clusterId
      editing
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateMpsSubscription = /* GraphQL */ `
  subscription OnUpdateMpsSubscription {
    onUpdateMpsSubscription {
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
      clusterId
      editing
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteMpsSubscription = /* GraphQL */ `
  subscription OnDeleteMpsSubscription {
    onDeleteMpsSubscription {
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
      clusterId
      editing
      createdAt
      updatedAt
    }
  }
`;
export const onCreateDriver = /* GraphQL */ `
  subscription OnCreateDriver {
    onCreateDriver {
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
      assignStatus
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateDriver = /* GraphQL */ `
  subscription OnUpdateDriver {
    onUpdateDriver {
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
      assignStatus
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteDriver = /* GraphQL */ `
  subscription OnDeleteDriver {
    onDeleteDriver {
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
      assignStatus
      createdAt
      updatedAt
    }
  }
`;
export const onCreateCluster = /* GraphQL */ `
  subscription OnCreateCluster {
    onCreateCluster {
      id
      name
      parentId
      subscriptionsCount
      color
      open
      level
      editing
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateCluster = /* GraphQL */ `
  subscription OnUpdateCluster {
    onUpdateCluster {
      id
      name
      parentId
      subscriptionsCount
      color
      open
      level
      editing
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteCluster = /* GraphQL */ `
  subscription OnDeleteCluster {
    onDeleteCluster {
      id
      name
      parentId
      subscriptionsCount
      color
      open
      level
      editing
      createdAt
      updatedAt
    }
  }
`;
export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo {
    onCreateTodo {
      id
      name
      description
      isComplete
      owner
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo {
    onUpdateTodo {
      id
      name
      description
      isComplete
      owner
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo {
    onDeleteTodo {
      id
      name
      description
      isComplete
      owner
      createdAt
      updatedAt
    }
  }
`;
