angular.module('todos').controller('TodosController', ['$scope', '$routeParams', '$location', '$filter', 'Authentication', 'Todos',
  function($scope, $routeParams, $location, $filter, Authentication, Todos) {

    var vm = this;

    vm.authentication = Authentication;

    vm.create = function() {
      var newTodo = new Todos({
        title: vm.newTodo,
        comment: vm.comment,
          mappings:vm.mappings
      });
        newTodo.mappings = [{
            "hl7": "PID.3.1",
            "fhir": "patient.identifier"
        }, {
            "hl7": "PID.5.1",
            "fhir": "patient.name.family"
        }]
      // Send newTodo to server for storage
      newTodo.$save(function(todo) {
      }, function(errorResponse) {
        vm.error = errorResponse.data.message;
      });

      // Add newTodo into list of Todos
      if(newTodo.title) {
        vm.todos.unshift(newTodo);
      }
      // Reset input field
      vm.newTodo = '';
    };

    vm.find = function() {
      vm.todos = Todos.query();
    };

    vm.findOne = function() {
      vm.todo = Todos.get({
        todoId: $routeParams.todoId
      });
    };

    vm.update = function() {
        var temp = {
            hl7:'test', fhir:'test'
        }
        vm.todo.mappings.push(temp);
      vm.todo.$update(function() {
        $location.path('todos/' + vm.todo._id);
      }, function(errorResponse) {
        vm.error = errorResponse.data.message;
      });
    };


    vm.delete = function(todo) {
      if(todo) {
        todo.$remove(function() {
          for(var i in vm.todos) {
            if(vm.todos[i] === todo) {
              vm.todos.splice(i, 1);
            }
          }
        });
      }
    };

    vm.checkAll = function() {
      vm.toggleAll = !vm.toggleAll;

      angular.forEach(vm.todos, function(todo) {
        todo.completed = vm.toggleAll;
        todo.$update();
      });
    };

    vm.clearCompleted = function() {
      var uncompletedTodos = [];
      angular.forEach(vm.todos, function(todo) {
        if(todo.completed) {
          todo.$remove();
        } else {
          uncompletedTodos.push(todo);
        }
      });

      vm.todos = uncompletedTodos;
    };

    // Watch Equality by Value (Third Param to True)
    $scope.$watch(function() {
      return vm.todos;
    }, function() {
      vm.remainingCount = $filter('filter')(vm.todos, { completed: false }).length;
      vm.completedCount = $filter('filter')(vm.todos, { completed: true }).length;
    }, true);

    vm.clearSearch = function() {
      vm.search = '';
    };

    //added for select box --
      $scope.showIngredientForm = false;
      $scope.toggleText = 'No';
      $scope.hl7 = [  "PID.8.1", "PID.7.1","PID.11"]
      $scope.fhir = [  "patient.gender", "patient.birthDate","patient.address"]

      $scope.mappingList = [{
          "_id": "5804b94790b0a11fc2aecef4",
          "hl7": "PID.8.1",
          "fhir":"patient.gender"
      }, {
          "_id": "5804ba2e90b0a11fc2aecef7",
          "hl7": "PID.7.1",
          "fhir":"patient.birthDate"
      }]

/*
      $scope.itemsToAdd = [{
          //ingredientTypeName: ''
          hl7:'',fhir:''
      }];
*/
      $scope.formsToAdd = [];

      $scope.$watch('showIngredientForm', function() {
          $scope.toggleText = $scope.showIngredientForm ? 'No' : 'Yes';
          if ($scope.showIngredientForm === true) {
            //  $scope.items = [];
             // $scope.itemsToAdd = {};
          }
      });

      $scope.addForm = function(formToAdd) {

          $scope.formsToAdd.push({});
      };
      $scope.removeForm = function(formToAdd) {
          var index = $scope.formsToAdd.indexOf(formToAdd);
          $scope.formsToAdd.splice(index, 1);
      };
/*
      $scope.remove = function(itemToAdd,key) {
          var index = $scope.itemsToAdd[key].indexOf(itemToAdd);
          $scope.itemsToAdd[key].splice(index, 1);
      };



      $scope.addNew = function(key) {
          if ($scope.itemsToAdd[key]== null) {
              $scope.itemsToAdd[key] = [];
          }
          $scope.itemsToAdd[key].push({
              hl7: {}, fhir: ''
              //  ingredientName: {}, ingredientPrice: ''
          });
      };


      $scope.verifyDuplicate = function() {
          console.log(JSON.stringify($scope.itemsToAdd));
          var sorted, i;

          sorted = $scope.itemsToAdd.concat().sort(function(a, b) {
              if (a.hl7 > b.hl7) return 1;
              if (a.hl7 < b.hl7) return -1;
              return 0;
          });
          for (i = 0; i < $scope.itemsToAdd.length; i++) {
              //sorted[i].isDuplicate = ((sorted[i - 1] && sorted[i - 1].ingredientName == sorted[i].ingredientName) || (sorted[i + 1] && sorted[i + 1].ingredientName == sorted[i].ingredientName));
              sorted[i].isDuplicate = ((sorted[i - 1] && sorted[i - 1].hl7 == sorted[i].hl7) || (sorted[i + 1] &&
                  sorted[i + 1].hl7 == sorted[i].hl7));
          }
      };
*/
      $scope.verifyDuplicateForm = function() {
          var sorted, i;

          sorted = $scope.formsToAdd.concat().sort(function(a, b) {
              if (a.hl7field > b.hl7field) return 1;
              if (a.hl7field < b.hl7field) return -1;
              return 0;
          });
          for (i = 0; i < $scope.formsToAdd.length; i++) {
              sorted[i].isDuplicateForm = ((sorted[i - 1] && sorted[i - 1].hl7field == sorted[i].hl7field) || (sorted[i + 1] &&
                  sorted[i + 1].hl7field == sorted[i].hl7field));
          }
      };
      var hl7data = {
          MSH: ['MSH.1', 'MSH.2', 'MSH.3', 'MSH.4','MSH.5','MSH.6','MSH.7', 'MSH.8', 'MSH.9', 'MSH.10','MSH.11','MSH.12'],
          PID: ['PID.1', 'PID.2', 'PID.3', 'PID.4','PID.5','PID.6','PID.7', 'PID.8', 'PID.9', 'PID.10','PID.11','PID.12'],
          PV1: ['PV1.1', 'PV1.2', 'PV1.3', 'PV1.4','PV1.5','PV1.6','PV1.7', 'PV1.8', 'PV1.9', 'PV1.10','PV1.11','PV1.12']

      };
      var fhirdata ={
          patient:['patient.identifier','patient.name.family','patient.name.given']
      };
      $scope.hl7array = hl7data;
      $scope.fhirarray = fhirdata;
      $scope.updatehl7 = function (a) {
          console.log(a);
      }
      $scope.updatemap2 = function (hl7field,fhirfield) {

          console.log(a);
      }

      vm.updatemap = function(hl7field,fhirfield) {
          var temp = {
              hl7:'test', fhir:'test'
          }

          vm.todo.mappings.push(temp);
          vm.todo.$update(function() {
              $location.path('todos/' + vm.todo._id);
          }, function(errorResponse) {
              vm.error = errorResponse.data.message;
          });
      };

  }


]);