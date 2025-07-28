import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent, DialogData } from './confirm-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;
  const mockDialogData: DialogData = {
    title: 'Test Title',
    message: 'Test Message'
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatButtonModule],
      declarations: [ConfirmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the provided title and message', () => {
    const titleElement = fixture.debugElement.query(By.css('h2[mat-dialog-title]')).nativeElement;
    const messageElement = fixture.debugElement.query(By.css('mat-dialog-content p')).nativeElement;
    
    expect(titleElement.textContent).toContain(mockDialogData.title);
    expect(messageElement.textContent).toContain(mockDialogData.message);
  });

  it('should have two action buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('mat-dialog-actions button'));
    expect(buttons.length).toBe(2);
  });

  it('should have a Cancel button that closes the dialog with no result', () => {
    const cancelButton = fixture.debugElement.query(By.css('button[mat-button]')).nativeElement;
    cancelButton.click();
    
    expect(mockDialogRef.close).toHaveBeenCalledWith(undefined);
  });

  it('should have a Confirm button that closes the dialog with true', () => {
    const confirmButton = fixture.debugElement.query(By.css('button[mat-raised-button]')).nativeElement;
    confirmButton.click();
    
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should apply warn color to confirm button', () => {
    const confirmButton = fixture.debugElement.query(By.css('button[mat-raised-button]')).nativeElement;
    expect(confirmButton.getAttribute('color')).toBe('warn');
  });

  it('should align actions to end', () => {
    const actionsElement = fixture.debugElement.query(By.css('mat-dialog-actions')).nativeElement;
    expect(actionsElement.getAttribute('align')).toBe('end');
  });
});