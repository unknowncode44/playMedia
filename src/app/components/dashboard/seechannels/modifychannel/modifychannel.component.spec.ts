import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifychannelComponent } from './modifychannel.component';

describe('ModifychannelComponent', () => {
  let component: ModifychannelComponent;
  let fixture: ComponentFixture<ModifychannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifychannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifychannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
