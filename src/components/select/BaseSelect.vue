<template>
  <select
    class="base-select"
    :class="[`size-${size}`, { disabled, invalid }]"
    :value="modelValue"
    :disabled="disabled"
    :required="required"
    :name="name"
    @change="onChange"
    v-bind="$attrs"
  >
    <!-- placeholder가 있으면 첫 항목으로 표시 -->
    <option v-if="placeholder" :value="placeholderValue" disabled hidden>
      {{ placeholder }}
    </option>

    <!-- options 배열로 전달 -->
    <option
      v-for="opt in options"
      :key="keyOf(opt)"
      :value="valueOf(opt)"
    >
      {{ labelOf(opt) }}
    </option>

    <!-- 또는 직접 <option> 슬롯 제공 -->
    <slot />
  </select>
</template>

<script setup>
/**
 * @component BaseSelect
 * @description
 * 기본 셀렉트 박스 컴포넌트  
 * - 문자열 배열 또는 `{ label, value }` 배열을 `options`로 받아 렌더링  
 * - placeholder를 첫 번째 비활성(hidden) 옵션으로 표시  
 * - 크기 프리셋(sm/md/lg) 및 invalid/disabled 상태 스타일 지원  
 * - 기본 `<option>` 슬롯으로 완전 커스터마이즈 가능
 *
 * @example
 * <!-- 문자열 배열 -->
 * <BaseSelect v-model="fruit" :options="['Apple','Banana','Cherry']" placeholder="선택하세요" />
 *
 * <!-- 객체 배열 -->
 * <BaseSelect
 *   v-model="country"
 *   :options="[{label:'대한민국', value:'KR'}, {label:'미국', value:'US'}]"
 *   size="lg"
 * />
 *
 * <!-- 직접 옵션 제공 -->
 * <BaseSelect v-model="grade">
 *   <option value="A">A 등급</option>
 *   <option value="B">B 등급</option>
 * </BaseSelect>
 */

/**
 * @typedef {Object} BaseSelectProps
 * @property {string|number|null} [modelValue=''] - 선택된 값 (v-model)
 * @property {Array<string|{label:string,value:any,id?:any,key?:any}>} [options=[]] - 옵션 목록
 * @property {string} [placeholder=''] - 첫 줄 placeholder (비활성/hidden)
 * @property {string} [name=''] - 네이티브 name
 * @property {boolean} [required=false] - 필수 여부
 * @property {boolean} [disabled=false] - 비활성화 여부
 * @property {boolean} [invalid=false] - 오류 스타일 활성화
 * @property {'sm'|'md'|'lg'} [size='md'] - 크기 프리셋
 */
const props = defineProps({
  modelValue: { type: [String, Number, null], default: '' },

  /** 문자열 배열 또는 {label, value} 배열 모두 허용 */
  options: { type: Array, default: () => [] },

  placeholder: { type: String, default: '' },
  name: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  invalid: { type: Boolean, default: false },

  /** sm | md | lg */
  size: { type: String, default: 'md' },
})

/**
 * @event update:modelValue - 선택 값이 변경될 때 발생 (payload: any)
 * @event change - 네이티브 change 이후 발생 (payload: any)
 */
const emit = defineEmits(['update:modelValue', 'change'])

/** placeholder의 내부 value (선택 불가) */
const placeholderValue = ''

/** change 핸들러: v-model과 change 이벤트 방출 */
function onChange(e) {
  const v = e.target.value
  emit('update:modelValue', v)
  emit('change', v)
}

/** 옵션 value 추출: 객체면 value/id/key 우선, 아니면 원본 */
function valueOf(opt) {
  return typeof opt === 'object' ? (opt.value ?? opt.id ?? opt.key ?? '') : opt
}
/** 옵션 라벨 추출: 객체면 label, 아니면 문자열화 */
function labelOf(opt) {
  return typeof opt === 'object' ? (opt.label ?? String(valueOf(opt))) : String(opt)
}
/** 옵션 key 생성 */
function keyOf(opt) {
  const v = valueOf(opt)
  return typeof v === 'object' ? JSON.stringify(v) : String(v)
}
</script>

<style scoped>
.base-select{
  width:100%;
  border:1px solid #cfd4dc;
  border-radius:12px;
  background:#fff;
  color:#111827;
  line-height:1.2;
  padding:0 12px;
  outline: none;
}
.base-select.size-sm{ height:32px; font-size:14px; }
.base-select.size-md{ height:38px; font-size:15px; }
.base-select.size-lg{ height:44px; font-size:16px; }

.base-select:focus{
  box-shadow:0 0 0 3px rgba(59,130,246,.25);
  border-color:#93c5fd;
}
.base-select.disabled{ background:#f3f4f6; color:#9ca3af; cursor:not-allowed; }
.base-select.invalid{ border-color:#ef4444; }
</style>
