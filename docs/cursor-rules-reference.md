# Cursor Rules Quick Reference

## Quick Commands for Angular Development

### Generate New Component
```bash
# In packages/angular-client-app/
ng generate component features/{feature-name}/components/{component-name} --standalone
```

### Component Boilerplate
```typescript
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'feature-component-name',
  imports: [CommonModule],
  templateUrl: './component.component.html',
  styleUrl: './component.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentNameComponent {
  @Input() data: Type | null = null;
  @Output() dataChange = new EventEmitter<Type>();
  
  state = signal<Type>(defaultValue);
  private service = inject(ServiceName);
}
```

### Store Pattern (Signal-based)
```typescript
@Injectable({ providedIn: 'root' })
export class FeatureStore {
  private _data = signal<Type[]>([]);
  readonly data = this._data.asReadonly();
  
  update(item: Type) {
    this._data.update(current => [...current, item]);
  }
}
```

### Service Pattern
```typescript
@Injectable({ providedIn: 'root' })
export class FeatureService {
  private http = inject(HttpClient);
  
  getData(): Observable<Type[]> {
    return this.http.get<Type[]>('/api/data');
  }
}
```

## File Structure Templates

### New Feature Structure
```
src/app/features/{feature-name}/
├── components/
│   └── {component-name}/
│       ├── {component}.component.ts
│       ├── {component}.component.html
│       ├── {component}.component.scss
│       ├── {component}.component.spec.ts
│       └── index.ts
├── store/
│   ├── {feature}.store.ts
│   └── index.ts
├── types.ts
├── {feature}.module.ts
└── {feature}.route.ts
```

### Export Pattern (index.ts)
```typescript
export * from './{component}.component';
```

## Common Patterns

### Event Cleanup
```typescript
export class Component implements OnDestroy {
  private cleanup: (() => void)[] = [];
  
  ngOnDestroy() {
    this.cleanup.forEach(fn => fn());
  }
  
  private addListener() {
    const handler = () => {};
    document.addEventListener('event', handler);
    this.cleanup.push(() => document.removeEventListener('event', handler));
  }
}
```

### TypeScript Interface
```typescript
export interface IEntity {
  id: string;
  name: string;
  optional?: Type;
}

export type EntityId = IEntity['id'];
```

### Route Configuration
```typescript
// Feature routes
export const featureRoutes: Routes = [
  { path: '', component: FeatureComponent },
];

// Main routes
export const routes: Routes = [
  {
    path: 'feature',
    loadChildren: () => import('./features/feature/feature.module').then(m => m.FeatureModule),
  },
];
```

## Testing Patterns

### Component Test
```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentName]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Import Patterns

### Angular Core Imports
```typescript
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  Output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
```

### Path Mapping
```typescript
import { AuthService } from '@core/services/auth';
import { RelativeComponent } from '../relative/component';
```

## SCSS Patterns

### Component Styles
```scss
:host {
  display: block;
  
  .wrapper {
    // styles
  }
  
  &.modifier {
    // modifier styles
  }
}
```

## Key Principles
1. **Always use OnPush change detection**
2. **Prefer ShadowDom encapsulation**
3. **Use signals for reactive state**
4. **Clean up event listeners**
5. **Use proper TypeScript typing**
6. **Follow feature-based architecture**
7. **Export from index.ts files**
8. **Write tests for all components** 