import { TestBed, async, fakeAsync, tick, flush, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { error } from 'util';
import { Observable, of, timer } from 'rxjs';
import { UsersComponent } from './users/users.component';

describe('AppComponent', () => {
  let originalTimeout;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        UsersComponent
      ],
    }).compileComponents();
  }));

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  /**************************
   *
   *  TESTs TO DEMO
   *
   * ************************/
  //Jasmine: demo async;
  //If we remove async() block, the test will pass :) 
  it('Should fail - demonstrate Jasmine sync', async(() => {
    console.log('Test start...')
    setTimeout(() => { //this creates a JS MacroTask
          expect(1).toBe(2); //wrong expectation
          console.log('In timeout ...');
    }, 3000);
    console.log('Test end.')
  }));

  
  //NB: When done is not called, a Timeout exception is thrown:
  //    * Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.
  //    * In the previous test done is called automatically by angular (transparent for the user)
  it('Should demonstrate Jasmine done callback function - old way of testing js async code ', ((done) => {
    const start = performance.now();
    let end = 0;
    setTimeout(() => { //this creates a JS MacroTask
          expect(1).toBe(1);
          end = performance.now() - start;
          console.log(end); // expect ~3000ms
          expect(end).toBeGreaterThan(3000);
          //done();
    }, 3000);
  }));


  //Test a method that returns a Promise with then()..(WORKS WELL :)
  //NB: the async is different than above async (from async/await);
  it('Should demonstrate Jasmine async await with asyncWithPromise', async(() => {
    console.log("Before async task...")
    doAsyncTaskWithPromise().then(result => {
      expect(result).toBe(10);
    })
    console.log("After async task...");      
  }));

  //Test a method that returns a Promise with async/await (WORKS WELL :)
  //NB: Take care of the syntax -- async()=> vs async( ()=> )
  it('Should demonstrate Jasmine async await with asyncWithPromise', async () => {
    console.log("Before async task...")
    let result  = await doAsyncTaskWithPromise();
    console.log("After async task...");    
    expect(result).toBe(10);
  });


  //Test a method that returns an Observable with subscribe().
  it('Should demonstrate asyncWithObservable with subscribe', async(() => {
    console.log("Before async task...")
    doAsyncTaskWithObservable().subscribe( result=>{
      console.log(result);
      expect(result).toBeGreaterThan(0); //10, 11, 12  values will be received here
    })
    console.log("After async task...")
    expect(1).toBe(1);
  }));


  //Test a method that returns an Observable with async/await. ??? HAS NO MUCH SENSE -- WE STILL HAVE TO subscribe()...
  it('Should demonstrate asyncWithObservable with async/await', async(async() => {
    console.log("Before async task...")
    let result = await doAsyncTaskWithObservable();
    result.subscribe(result=>{
      console.log(result);
      expect(result).toBeGreaterThan(0); //10, 11, 12  values will be received here
    })
    console.log("After async task...")
    expect(1).toBe(1);
  }));
  

  //Jasmine: Should fail if an exception is thrown in a promise (async / or not?!!!)
  //NB: If we remove async() the test will pass even if an exception is thrown in the Promise
  it('Should demonstrate Jasmine sync vs async 1', async(() => {
    doAsyncTaskWithPromiseWithException();
  }));

  //Jasmine: Should fail if an exception is thrown in an observable (async / or not?!!!)
  //NB: If we remove async() the test will pass even if an exception is thrown in the Promise
  it('Should demonstrate Jasmine sync vs async 1', async(() => {
    doAsyncTaskWithObservableWithException().subscribe(result=>{
      console.log(result);
      expect(result).toBe(10);
    });
  }));


  //NB -- If we comment the first tick() the test will fail
  // *  test is liniar, no more then() with expects
  // *  faster
  // *  drawback -- not able to catch XHR requests -- so take care when to use it
  // *  Is not enought to put fakeAsync in front of a ()=> ;we should change the syntax of the test also 
  it('Demo fakeAsync with setTimeout -- looks async but is synchronous', fakeAsync((): void => {
    let flag = false;
    setTimeout(() => { flag = true; }, 100);
    expect(flag).toBe(false);
    tick(50);
    expect(flag).toBe(false);
    tick(50);
    expect(flag).toBe(true);
  }));
  

  it('Demo fakeAsync with promise() -- looks async but is synchronous', fakeAsync((): void => {
    let number = 0;
    const start = new Date().getTime();
    doAsyncTaskWithPromise().then(n=> number = n)
    expect(number).toBe(0);
    tick();
    const duration  = new Date().getTime() - start;
    expect(number).toBe(10);
  }));
  /////////////////////////////////////////////////////////////////////////////////
  
  
  
  



  //===========================
  //////////////////          Some async functions   //////////////////////////
  //==========================

 
  function doAsyncTaskWithTimeout() {
    setTimeout(() => {
        console.log('Async2 Work Complete');
    }, 5000);
  }

  function doAsyncTaskWithPromise(): Promise<number> {
    const promise = new Promise<number>((resolve, reject) => {
      setTimeout(() => {
        console.log('Async - Promise - work complete');
        if (error) {
          reject();
        } else {
          resolve(10);
        }
      }, 0);
    });
    return promise;
  }

 

  function doAsyncTaskWithPromiseWithException(): Promise<number> {
    const promise = new Promise<number>((resolve, reject) => {
      setTimeout(() => {
        console.log('Async - Promise - work complete');
        if (true) {
          throw new Error('Something bad happened!');
        }    
      }, 2000);
    });
    return promise;
  }

  

  function doAsyncTaskWithObservable(): Observable<number> {
    let ob = Observable.create((observer) => {
      console.log("Async - Observable - emitting ...");
      setTimeout(()=>{
        observer.next(10);        
      },1000);
      setTimeout(()=>{
        observer.next(11);        
      },2000);
      setTimeout(()=>{
        observer.next(12);
        //observer.complete();
      },3000);                  
    });
    return ob;
  }

  function doAsyncTaskWithObservableWithException(): Observable<number> {
    let ob = Observable.create((observer) => {
      console.log("Async - Observable - emitting ...");
      setTimeout(()=>{
        observer.next(10);
        throw new Error('Something bad happened!');
      },3000);
    });
    return ob;
  }


});
