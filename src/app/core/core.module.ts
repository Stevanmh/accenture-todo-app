import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
  imports: [
    CommonModule,
    IonicStorageModule.forRoot() // Registers the storage engine as a singleton
  ]
})
export class CoreModule {
  /**
   * Guard against importing CoreModule more than once.
   * CoreModule must only be imported in AppModule.
   */
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in AppModule only.');
    }
  }
}
