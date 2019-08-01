import { async, ComponentFixture, TestBed, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';

import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
   // tick();
    fixture.detectChanges();
    tick(2001);
    console.log("Detect changes triggered ..");
  }));


  //Test that demo the whenStable function
  //TODO: without whenStable()  expect does not pass
  it('Should demo the whenStable function', async(() => {
    console.log("Test started ...");
    const numberOfUsers = 5;    
    expect(component).toBeTruthy();    
    
    //expect(component.users.length).toBe(numberOfUsers);
    fixture.whenStable().then(()=>{
      console.log("Is stable ...")
      expect(component.users.length).toBe(numberOfUsers);
    })    
    console.log("Test end")
  }));


  // Practice for ICP team -- make this working :)
  //Why it does not work?
  //How to fix this test?
  fit('This should demo that fakeAsync is not alsways good -- check our creatives tests also!!!! ', fakeAsync(() => {
    console.log("Test started ...");
    const numberOfUsers = 5;    
    expect(component).toBeTruthy();    
    //expect(component.users.length).toBe(numberOfUsers);

    tick(5000);
    //flushMicrotasks();

    expect(component.users.length).toBe(numberOfUsers); ///it will not work
    console.log("Test end")
  }));
});
