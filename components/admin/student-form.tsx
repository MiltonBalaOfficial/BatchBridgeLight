'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Student,
  College,
  SocialLink,
  HostelHistoryEntry,
  HostelMemories,
  PrivacyObject,
  PrivacyLevel,
  SeniorityFilter,
  GenderFilter,
  AcademicStructure,
  ProfessionalInfo,
  DegreeEntry,
  WorkExperienceEntry,
} from '@/lib/types';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { FormHeader } from './student-form-header';
import isEqual from 'lodash.isequal';

// ... (keep all the const arrays and helper functions like toOrdinal, PrivacyControls)

const socialTypes: SocialLink['type'][] = [
  'instagram',
  'facebook',
  'twitter',
  'linkedin',
  'youtube',
  'website',
  'discord',
  'github',
];

const privacyLevelOptions: {
  label: string;
  options: { value: PrivacyLevel; label: string }[];
}[] = [
  {
    label: 'Core Groups',
    options: [
      { value: 'public', label: 'Public' },
      { value: 'onlyMe', label: 'Only Me' },
      { value: 'allUsers', label: 'All Logged-in Users' },
    ],
  },
  {
    label: 'Manual Relationships',
    options: [
      { value: 'friends', label: 'Friends' },
      { value: 'closedFriends', label: 'Closed Friends' },
    ],
  },
  {
    label: 'College & Hostel Groups',
    options: [
      { value: 'collegeBuddy', label: 'College Buddy' },
      { value: 'hostelBuddy', label: 'Hostel Buddy' },
    ],
  },
  {
    label: 'Location-Based Groups',
    options: [{ value: 'fromMyState', label: 'From My State' }],
  },
  {
    label: 'Platform-Wide Groups',
    options: [
      { value: 'yearMate', label: 'Year Mate' },
      { value: 'alumni', label: 'Alumni' },
      { value: 'verifiedUsers', label: 'Verified Users' },
    ],
  },
  {
    label: 'Administrative',
    options: [{ value: 'admin', label: 'Admin' }],
  },
];

const seniorityFilterOptions: { value: SeniorityFilter; label: string }[] = [
  { value: 'all', label: 'All Seniorities' },
  { value: 'batchmatesOnly', label: 'Batchmates Only' },
  { value: 'seniorsOnly', label: 'Seniors Only' },
  { value: 'juniorsOnly', label: 'Juniors Only' },
  { value: 'notSeniors', label: 'Not Seniors (Batchmates & Juniors)' },
  { value: 'notJuniors', label: 'Not Juniors (Batchmates & Seniors)' },
];

const genderFilterOptions: { value: GenderFilter; label: string }[] = [
  { value: 'all', label: 'All Genders' },
  { value: 'sameGender', label: 'Same Gender' },
  { value: 'oppositeGender', label: 'Opposite Gender' },
];

const toOrdinal = (n: number): string => {
  if (isNaN(n) || n < 1) return '';
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const PrivacyControls = ({
  name,
  value,
  onChange,
  disabled = false,
}: {
  name: string;
  value: PrivacyObject;
  onChange: (name: string, value: PrivacyObject) => void;
  disabled?: boolean;
}) => {
  const handlePrivacyChange = (
    field: keyof PrivacyObject,
    fieldValue: string
  ) => {
    onChange(name, { ...value, [field]: fieldValue });
  };

  return (
    <div className='w-full space-y-2 rounded-md border bg-slate-50 p-4 dark:bg-slate-900'>
      <Label>Privacy Controls</Label>
      <div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
        <div>
          <Label
            htmlFor={`${name}-level`}
            className='text-xs text-muted-foreground'
          >
            Visible To
          </Label>
          <Select
            name={`${name}-level`}
            onValueChange={(val) => handlePrivacyChange('level', val)}
            value={value.level}
            disabled={disabled}
          >
            <SelectTrigger disabled={disabled}>
              <SelectValue placeholder='Select group' />
            </SelectTrigger>
            <SelectContent>
              {privacyLevelOptions.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label
            htmlFor={`${name}-seniority`}
            className='text-xs text-muted-foreground'
          >
            Filter by Seniority
          </Label>
          <Select
            name={`${name}-seniority`}
            onValueChange={(val) => handlePrivacyChange('seniority', val)}
            value={value.seniority}
            disabled={disabled}
          >
            <SelectTrigger disabled={disabled}>
              <SelectValue placeholder='Select seniority' />
            </SelectTrigger>
            <SelectContent>
              {seniorityFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label
            htmlFor={`${name}-gender`}
            className='text-xs text-muted-foreground'
          >
            Filter by Gender
          </Label>
          <Select
            name={`${name}-gender`}
            onValueChange={(val) => handlePrivacyChange('gender', val)}
            value={value.gender}
            disabled={disabled}
          >
            <SelectTrigger disabled={disabled}>
              <SelectValue placeholder='Select gender' />
            </SelectTrigger>
            <SelectContent>
              {genderFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

const defaultPrivacy: PrivacyObject = {
  level: 'public',
  seniority: 'all',
  gender: 'all',
};

interface StudentFormProps {
  student?: Partial<Student>;
  isNew?: boolean;
}

export const StudentForm = ({ student, isNew = false }: StudentFormProps) => {
  const getInitialFormData = (): Partial<Student> => {
    if (student) {
      return student;
    }
    if (isNew) {
      return {
        admissionYear: new Date().getFullYear(),
        privacy_profile: { ...defaultPrivacy },
        privacy_contact_email: { ...defaultPrivacy },
        privacy_socials: { ...defaultPrivacy },
        privacy_birth_day: {
          ...defaultPrivacy,
          level: 'collegeBuddy',
          seniority: 'batchmatesOnly',
        },
        privacy_birth_month: {
          ...defaultPrivacy,
          level: 'collegeBuddy',
          seniority: 'batchmatesOnly',
        },
        privacy_contact_whatsapp: {
          ...defaultPrivacy,
          level: 'collegeBuddy',
          seniority: 'batchmatesOnly',
        },
        privacy_birth_year: { ...defaultPrivacy, level: 'onlyMe' },
        privacy_contact_phone: {
          ...defaultPrivacy,
          level: 'collegeBuddy',
          seniority: 'batchmatesOnly',
        },
        privacy_contact_alt_email: { ...defaultPrivacy, level: 'onlyMe' },
        privacy_contact_alt_phone: { ...defaultPrivacy, level: 'onlyMe' },
        privacy_contact_telegram: { ...defaultPrivacy },
        privacy_permanentAddress: { ...defaultPrivacy, level: 'onlyMe' },
        privacy_currentAddress: { ...defaultPrivacy, level: 'collegeBuddy' },
        privacy_profileImage: { ...defaultPrivacy },
        privacy_bio: { ...defaultPrivacy },
        privacy_hostelHistory: { ...defaultPrivacy, level: 'onlyMe' },
        privacy_hostelMemories: { ...defaultPrivacy, level: 'onlyMe' },
        privacy_professionalInfo: { ...defaultPrivacy, level: 'public' },
        professionalInfo: {
          ProfessionalPreNominal: '',
          speciality: '',
          degrees: [],
          workExperience: [],
        },
      };
    }
    return {};
  };

  const [formData, setFormData] =
    useState<Partial<Student>>(getInitialFormData());
  const [colleges, setColleges] = useState<College[]>([]);
  const [collegeBatchRaw, setCollegeBatchRaw] = useState<number | ''>('');
  const [academicStructure, setAcademicStructure] = useState<AcademicStructure>(
    []
  );
  const [courseSystem, setCourseSystem] = useState<'year' | 'semester'>('year');
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [hostelHistory, setHostelHistory] = useState<HostelHistoryEntry[]>([]);
  const [hostelMemories, setHostelMemories] = useState<HostelMemories>({
    images: [],
    videos: [],
  });
  const [professionalInfo, setProfessionalInfo] = useState<ProfessionalInfo>({
    degrees: [],
    workExperience: [],
  });
  const [showCustomPrenominalInput, setShowCustomPrenominalInput] =
    useState(false);
  const [isSameAsPermanentAddress, setIsSameAsPermanentAddress] =
    useState(false);
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
    useState(false);
  const initialFormData = useRef<Partial<Student>>(getInitialFormData());

  const degrees = useMemo(
    () => academicStructure.filter((node) => node.type === 'degree'),
    [academicStructure]
  );

  const courseOptions = useMemo(() => {
    if (!formData.degree || !academicStructure.length) return [];
    const selectedDegree = academicStructure.find(
      (d) => d.type === 'degree' && d.name === formData.degree
    );
    if (!selectedDegree) return [];

    return academicStructure.filter(
      (c) =>
        c.type === 'course' &&
        c.parentId === selectedDegree.id &&
        c.academicSystem === courseSystem
    );
  }, [formData.degree, academicStructure, courseSystem]);

  const hasUnsavedChanges = () => {
    return !isEqual(initialFormData.current, {
      ...formData,
      socials,
      hostelHistory,
      hostelMemories,
      professionalInfo,
    });
  };

  useEffect(() => {
    const fetchColleges = async () => {
      const res = await fetch('/api/colleges');
      const data = await res.json();
      setColleges(data);

      const structureRes = await fetch('/api/academic-structure');
      const structureData: AcademicStructure = await structureRes.json();
      setAcademicStructure(structureData);
    };
    fetchColleges();
  }, []);

  useEffect(() => {
    if (student) {
      const studentData = { ...student };
      setFormData(studentData);
      setSocials(student.socials || []);
      setHostelHistory(student.hostelHistory || []);
      setHostelMemories(student.hostelMemories || { images: [], videos: [] });
      setProfessionalInfo(
        student.professionalInfo || {
          ProfessionalPreNominal: '',
          degrees: [],
          workExperience: [],
        }
      );
      if (
        student.professionalInfo?.ProfessionalPreNominal &&
        !['Dr.', 'Er.', 'Adv.', ''].includes(
          student.professionalInfo.ProfessionalPreNominal
        )
      ) {
        setShowCustomPrenominalInput(true);
      } else {
        setShowCustomPrenominalInput(false);
      }
      if (student.collegeBatch) {
        const match = student.collegeBatch.match(/(\d+)/);
        if (match) {
          setCollegeBatchRaw(parseInt(match[1], 10));
        }
      }
      // Determine initial courseSystem
      if (student.academicSystem) {
        setCourseSystem(student.academicSystem);
      } else if (student.currentCourse) {
        const course = academicStructure.find(
          (c) => c.id === student.currentCourse
        );
        if (course && course.academicSystem) {
          setCourseSystem(course.academicSystem);
        }
      }

      initialFormData.current = {
        ...studentData,
        socials: student.socials || [],
        hostelHistory: student.hostelHistory || [],
        hostelMemories: student.hostelMemories || { images: [], videos: [] },
        professionalInfo: student.professionalInfo || {
          degrees: [],
          workExperience: [],
        },
      };
    }
  }, [student, academicStructure]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const parsedValue =
      type === 'number' && value !== '' ? parseInt(value, 10) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSelectChange = (name: string, value: string | PrivacyObject) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (formData.degree && academicStructure.length > 0) {
      // Reset currentCourse only if degree changes
      if (isNew || formData.degree !== student?.degree) {
        setFormData((prev) => ({ ...prev, currentCourse: '' }));
      }
    } else {
      // If degree becomes empty, always reset currentCourse
      if (isNew || formData.degree !== student?.degree) {
        setFormData((prev) => ({ ...prev, currentCourse: '' }));
      }
    }
  }, [formData.degree, student?.degree, isNew, academicStructure]);

  const handleCollegeBatchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value === '' ? '' : parseInt(value, 10);
    setCollegeBatchRaw(numValue);

    if (typeof numValue === 'number' && !isNaN(numValue) && numValue > 0) {
      const formattedBatch = `${toOrdinal(numValue)} Batch`;
      setFormData((prev) => ({
        ...prev,
        collegeBatch: formattedBatch,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        collegeBatch: '',
      }));
    }
  };

  const handleSocialChange = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    const newSocials = [...socials];
    newSocials[index] = { ...newSocials[index], [field]: value };
    setSocials(newSocials);
  };

  const addSocial = () => {
    setSocials([...socials, { type: 'instagram', url: '' }]);
  };

  const removeSocial = (index: number) => {
    const newSocials = socials.filter((_, i) => i !== index);
    setSocials(newSocials);
  };

  const handleHostelHistoryChange = (
    index: number,
    field: keyof HostelHistoryEntry,
    value: string
  ) => {
    const newHostelHistory = [...hostelHistory];
    newHostelHistory[index] = { ...newHostelHistory[index], [field]: value };
    setHostelHistory(newHostelHistory);
  };

  const addHostelHistory = () => {
    setHostelHistory([
      ...hostelHistory,
      {
        type: 'hosteller',
        building: '',
        room: '',
        bed: '',
        entry: '',
        exit: '',
      },
    ]);
  };

  const removeHostelHistory = (index: number) => {
    const newHostelHistory = hostelHistory.filter((_, i) => i !== index);
    setHostelHistory(newHostelHistory);
  };

  const handleDegreeChange = (
    index: number,
    field: keyof DegreeEntry,
    value: string | number
  ) => {
    const newDegrees = [...professionalInfo.degrees];
    newDegrees[index] = { ...newDegrees[index], [field]: value };
    setProfessionalInfo((prev) => ({ ...prev, degrees: newDegrees }));
  };

  const addDegree = () => {
    setProfessionalInfo((prev) => ({
      ...prev,
      degrees: [...prev.degrees, { degreeName: '', institution: '' }],
    }));
  };

  const removeDegree = (index: number) => {
    const newDegrees = professionalInfo.degrees.filter((_, i) => i !== index);
    setProfessionalInfo((prev) => ({ ...prev, degrees: newDegrees }));
  };

  const handleWorkExperienceChange = (
    index: number,
    field: keyof WorkExperienceEntry,
    value: string
  ) => {
    const newWorkExperience = [...professionalInfo.workExperience];
    newWorkExperience[index] = { ...newWorkExperience[index], [field]: value };
    setProfessionalInfo((prev) => ({
      ...prev,
      workExperience: newWorkExperience,
    }));
  };

  const addWorkExperience = () => {
    setProfessionalInfo((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        { designation: '', workplace: '' },
      ],
    }));
  };

  const removeWorkExperience = (index: number) => {
    const newWorkExperience = professionalInfo.workExperience.filter(
      (_, i) => i !== index
    );
    setProfessionalInfo((prev) => ({
      ...prev,
      workExperience: newWorkExperience,
    }));
  };

  const handleHostelMemoriesChange = (
    field: 'images' | 'videos',
    value: string
  ) => {
    setHostelMemories((prev) => ({
      ...prev,
      [field]: value.split(',').map((item) => item.trim()),
    }));
  };

  const handleSameAsPermanentAddressChange = (checked: boolean) => {
    setIsSameAsPermanentAddress(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        current_houseNo: prev.permanent_houseNo,
        current_street: prev.permanent_street,
        current_area: prev.permanent_area,
        current_landmark: prev.permanent_landmark,
        current_post_office: prev.permanent_post_office,
        current_district: prev.permanent_district,
        current_state: prev.permanent_state,
        current_country: prev.permanent_country,
        current_pincode: prev.permanent_pincode,
        privacy_currentAddress: prev.privacy_permanentAddress,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        current_houseNo: '',
        current_street: '',
        current_area: '',
        current_landmark: '',
        current_post_office: '',
        current_district: '',
        current_state: '',
        current_country: '',
        current_pincode: '',
        privacy_currentAddress: { ...defaultPrivacy }, // Default privacy when cleared
      }));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const url = isNew ? '/api/students' : `/api/students/${student?.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const dataToSave: Partial<Student> = {
      ...formData,
      academicSystem: courseSystem,
      socials,
      hostelHistory,
      hostelMemories,
      professionalInfo,
      id: isNew ? uuidv4() : student?.id,
      updated_at: new Date().toISOString(),
    };

    if (isNew) {
      dataToSave.created_at = new Date().toISOString();
      // Remove system-managed fields for new student creation, backend will handle these
      delete dataToSave.slug;
      delete dataToSave.role;
      delete dataToSave.accountStatus;
      delete dataToSave.deletedAt;
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSave),
    });

    setIsSaving(false);

    if (response.ok) {
      initialFormData.current = dataToSave; // Update initial state to prevent unsaved changes dialog
      router.push('/admin/students');
      router.refresh();
    } else {
      const errorData = await response.json();
      console.error('Failed to save student:', errorData);
      alert(`Failed to save student: ${errorData.message || 'Unknown error'}`);
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedChangesDialog(true);
    } else {
      router.push('/admin/students');
    }
  };

  const renderField = (
    label: string,
    name: keyof Student,
    type = 'text',
    required = false,
    placeholder = '',
    disabled = false
  ) => {
    const value = formData[name];

    return (
      <div>
        <Label htmlFor={name}>{label}</Label>
        <Input
          id={name}
          name={name}
          type={type}
          value={String(value || '')}
          onChange={handleChange}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    );
  };

  const renderFieldWithPrivacy = (
    label: string,
    name: keyof Student,
    type = 'text',
    required = false,
    placeholder = '',
    privacyFieldName: keyof Student,
    disabled = false
  ) => {
    const value = formData[name];
    const privacyValue =
      (formData[privacyFieldName] as PrivacyObject) || defaultPrivacy;

    return (
      <div className='rounded-md border p-4'>
        <div className='space-y-4'>
          <div className='flex-grow'>
            <Label htmlFor={name}>{label}</Label>
            <Input
              id={name}
              name={name}
              type={type}
              value={String(value || '')}
              onChange={handleChange}
              required={required}
              placeholder={placeholder}
              disabled={disabled}
            />
          </div>
          <PrivacyControls
            name={privacyFieldName as string}
            value={privacyValue}
            onChange={handleSelectChange}
            disabled={disabled}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <FormHeader
        onSave={handleSubmit}
        onBack={handleBack}
        isSaving={isSaving}
      />
      <AlertDialog
        open={showUnsavedChangesDialog}
        onOpenChange={setShowUnsavedChangesDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave? Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/admin/students')}>
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <form onSubmit={handleSubmit} className='space-y-8'>
        <Accordion type='single' collapsible className='w-full'>
          <AccordionItem value='basic-info'>
            <AccordionTrigger>
              <CardHeader className='flex-row items-center p-0'>
                <CardTitle className='flex-1 text-lg font-semibold whitespace-nowrap text-blue-600'>
                  Basic Information
                </CardTitle>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className='space-y-6 bg-slate-900 p-5'>
                <div className='rounded-md border p-4'>
                  <div className='space-y-2'>
                    <Label>Profile Privacy</Label>
                    <p className='text-sm text-muted-foreground'>
                      Set the privacy for your overall profile.
                    </p>
                    <PrivacyControls
                      name='privacy_profile'
                      value={formData.privacy_profile || defaultPrivacy}
                      onChange={handleSelectChange}
                    />
                  </div>
                </div>
                {renderField('First Name', 'name_first', 'text', true)}
                {renderField('Middle Name', 'name_middle')}
                {renderField('Last Name', 'name_last', 'text', true)}
                <div>
                  <Label htmlFor='gender'>Gender</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange('gender', value)
                    }
                    value={formData.gender}
                  >
                    <SelectTrigger id='gender'>
                      <SelectValue placeholder='Select gender' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='male'>Male</SelectItem>
                      <SelectItem value='female'>Female</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                      <SelectItem value='preferNotToSay'>
                        Prefer Not to Say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Degree Field */}
                <div>
                  <Label htmlFor='degree'>Degree</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange('degree', value)
                    }
                    value={formData.degree}
                    required
                  >
                    <SelectTrigger id='degree'>
                      <SelectValue placeholder='Select a degree' />
                    </SelectTrigger>
                    <SelectContent>
                      {degrees.map((degree) => (
                        <SelectItem key={degree.id} value={degree.name}>
                          {degree.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className='grid grid-cols-3 gap-4'>
                    <div className='col-span-2'>
                      <Label htmlFor='collegeId'>College</Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange('collegeId', value)
                        }
                        value={formData.collegeId}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select a college' />
                        </SelectTrigger>
                        <SelectContent>
                          {colleges.map((college) => (
                            <SelectItem key={college.id} value={college.id}>
                              {college.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                {renderField('Admission Year', 'admissionYear', 'number', true)}
                <div>
                  <Label htmlFor='collegeBatch'>College Batch</Label>
                  <Input
                    id='collegeBatch'
                    name='collegeBatch'
                    type='number'
                    value={collegeBatchRaw}
                    onChange={handleCollegeBatchChange}
                    required
                    placeholder='e.g., 12'
                  />
                  {formData.collegeBatch && (
                    <p className='text-sm text-muted-foreground'>
                      Formatted: {formData.collegeBatch}
                    </p>
                  )}
                </div>

                {/* Course System Selector */}
                <div className='space-y-2'>
                  <Label>Academic System</Label>
                  <RadioGroup
                    value={courseSystem}
                    onValueChange={(value: 'year' | 'semester') => {
                      setCourseSystem(value);
                      // Reset the course selection when system changes
                      setFormData((prev) => ({
                        ...prev,
                        currentCourse: '',
                      }));
                    }}
                    className='flex space-x-4'
                  >
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='year' id='system-year' />
                      <Label htmlFor='system-year'>Year-based</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='semester' id='system-semester' />
                      <Label htmlFor='system-semester'>Semester-based</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor='currentCourse'>
                    {courseSystem === 'year' ? 'Year' : 'Semester'}
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange('currentCourse', value)
                    }
                    value={formData.currentCourse}
                    disabled={!formData.degree}
                  >
                    <SelectTrigger id='currentCourse'>
                      <SelectValue
                        placeholder={`Select a ${
                          courseSystem === 'year' ? 'year' : 'semester'
                        }`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {courseOptions.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {renderField('Passed Out Year', 'passedOut', 'number')}
                <div>
                  <Label htmlFor='ProfessionalPreNominal'>
                    Professional Pre-Nominal
                  </Label>
                  <Select
                    value={
                      professionalInfo.ProfessionalPreNominal === ''
                        ? 'none'
                        : ['Dr.', 'Er.', 'Adv.'].includes(
                            professionalInfo.ProfessionalPreNominal || ''
                          )
                          ? professionalInfo.ProfessionalPreNominal || ''
                          : 'Other'
                    }
                    onValueChange={(value) => {
                      if (value === 'Other') {
                        setShowCustomPrenominalInput(true);
                        // Optionally clear the prenominal if it was a predefined one,
                        // otherwise keep the custom one if it exists, for editing.
                        if (
                          ['Dr.', 'Er.', 'Adv.', 'none'].includes(
                            professionalInfo.ProfessionalPreNominal || ''
                          )
                        ) {
                          setProfessionalInfo((prev) => ({
                            ...prev,
                            ProfessionalPreNominal: '',
                          }));
                        }
                      } else {
                        setShowCustomPrenominalInput(false);
                        setProfessionalInfo((prev) => ({
                          ...prev,
                          ProfessionalPreNominal:
                            value === 'none' ? '' : value,
                        }));
                      }
                    }}
                    disabled={!formData.passedOut}
                  >
                    <SelectTrigger id='ProfessionalPreNominal'>
                      <SelectValue placeholder='Select pre-nominal' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='none'>No Prenominal</SelectItem>
                      <SelectItem value='Dr.'>Dr.</SelectItem>
                      <SelectItem value='Er.'>Er.</SelectItem>
                      <SelectItem value='Adv.'>Adv.</SelectItem>
                      <SelectItem value='Other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.passedOut && showCustomPrenominalInput && (
                    <Input
                      className='mt-2'
                      placeholder='Type custom pre-nominal'
                      value={professionalInfo.ProfessionalPreNominal || ''}
                      onChange={(e) =>
                        setProfessionalInfo((prev) => ({
                          ...prev,
                          ProfessionalPreNominal: e.target.value,
                        }))
                      }
                      disabled={!formData.passedOut}
                    />
                  )}
                </div>
              </CardContent>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='profile-details'>
            <AccordionTrigger>
              <CardHeader className='flex-row items-center p-0'>
                <CardTitle className='flex-1 text-lg font-semibold whitespace-nowrap text-blue-600'>
                  Profile Details
                </CardTitle>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className='space-y-6 bg-slate-900 p-5'>
                {renderFieldWithPrivacy(
                  'Profile Image URL',
                  'profileImage',
                  'text',
                  false,
                  'e.g., /students/image.png',
                  'privacy_profileImage'
                )}
                {renderFieldWithPrivacy(
                  'Birth Day',
                  'birth_day',
                  'number',
                  false,
                  '',
                  'privacy_birth_day'
                )}
                {renderFieldWithPrivacy(
                  'Birth Month',
                  'birth_month',
                  'number',
                  false,
                  '',
                  'privacy_birth_month'
                )}
                {renderFieldWithPrivacy(
                  'Birth Year',
                  'birth_year',
                  'number',
                  false,
                  '',
                  'privacy_birth_year'
                )}
                <div className='rounded-md border p-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='bio'>Bio</Label>
                    <Textarea
                      id='bio'
                      name='bio'
                      value={formData.bio || ''}
                      onChange={handleChange}
                      placeholder='A short bio about the student...'
                    />
                    <PrivacyControls
                      name='privacy_bio'
                      value={formData.privacy_bio || defaultPrivacy}
                      onChange={handleSelectChange}
                    />
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='professional-info'>
            <AccordionTrigger>
              <CardHeader className='flex-row items-center p-0'>
                <CardTitle className='flex-1 text-lg font-semibold whitespace-nowrap text-blue-600'>
                  Professional Information
                </CardTitle>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className='space-y-6 bg-slate-900 p-5'>
                <div className='rounded-md border p-4'>
                  <div className='space-y-2'>
                    <Label>Professional Info Privacy</Label>
                    <p className='text-sm text-muted-foreground'>
                      Set the privacy for your professional information.
                    </p>
                    <PrivacyControls
                      name='privacy_professionalInfo'
                      value={
                        formData.privacy_professionalInfo || defaultPrivacy
                      }
                      onChange={handleSelectChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='speciality'>Speciality</Label>
                  <Input
                    id='speciality'
                    name='speciality'
                    value={professionalInfo.speciality || ''}
                    onChange={(e) =>
                      setProfessionalInfo((prev) => ({
                        ...prev,
                        speciality: e.target.value,
                      }))
                    }
                  />
                </div>

                <h3 className='font-semibold'>Degrees</h3>
                {professionalInfo.degrees.map((degree, index) => (
                  <div key={index} className='space-y-4 rounded-md border p-4'>
                    <div className='flex items-center justify-between'>
                      <h4 className='text-md font-semibold'>
                        Degree {index + 1}
                      </h4>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={() => removeDegree(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div>
                        <Label>Degree Name</Label>
                        <Input
                          value={degree.degreeName}
                          onChange={(e) =>
                            handleDegreeChange(
                              index,
                              'degreeName',
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>Institution</Label>
                        <Input
                          value={degree.institution}
                          onChange={(e) =>
                            handleDegreeChange(
                              index,
                              'institution',
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>Year</Label>
                        <Input
                          type='number'
                          value={degree.year || ''}
                          onChange={(e) =>
                            handleDegreeChange(index, 'year', e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button type='button' onClick={addDegree}>
                  Add Degree
                </Button>

                <h3 className='font-semibold'>Work Experience</h3>
                {professionalInfo.workExperience.map((exp, index) => (
                  <div key={index} className='space-y-4 rounded-md border p-4'>
                    <div className='flex items-center justify-between'>
                      <h4 className='text-md font-semibold'>
                        Work Experience {index + 1}
                      </h4>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={() => removeWorkExperience(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div>
                        <Label>Designation</Label>
                        <Input
                          value={exp.designation}
                          onChange={(e) =>
                            handleWorkExperienceChange(
                              index,
                              'designation',
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>Workplace</Label>
                        <Input
                          value={exp.workplace}
                          onChange={(e) =>
                            handleWorkExperienceChange(
                              index,
                              'workplace',
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>From</Label>
                        <Input
                          type='date'
                          value={exp.from || ''}
                          onChange={(e) =>
                            handleWorkExperienceChange(
                              index,
                              'from',
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>To</Label>
                        <Input
                          type='date'
                          value={exp.to || ''}
                          onChange={(e) =>
                            handleWorkExperienceChange(
                              index,
                              'to',
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button type='button' onClick={addWorkExperience}>
                  Add Work Experience
                </Button>
              </CardContent>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='contact-info'>
            <AccordionTrigger>
              <CardHeader className='flex-row items-center p-0'>
                <CardTitle className='flex-1 text-lg font-semibold whitespace-nowrap text-blue-600'>
                  Contact Information
                </CardTitle>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className='space-y-6 bg-slate-900 p-5'>
                {renderFieldWithPrivacy(
                  'Email',
                  'contact_email',
                  'email',
                  true,
                  '',
                  'privacy_contact_email'
                )}
                {renderFieldWithPrivacy(
                  'Phone',
                  'contact_phone',
                  'text',
                  false,
                  '',
                  'privacy_contact_phone'
                )}
                {renderFieldWithPrivacy(
                  'Alternative Email',
                  'contact_alt_email',
                  'email',
                  false,
                  '',
                  'privacy_contact_alt_email'
                )}
                {renderFieldWithPrivacy(
                  'Alternative Phone',
                  'contact_alt_phone',
                  'text',
                  false,
                  '',
                  'privacy_contact_alt_phone'
                )}
                {renderFieldWithPrivacy(
                  'WhatsApp',
                  'contact_whatsapp',
                  'text',
                  false,
                  '',
                  'privacy_contact_whatsapp'
                )}
                {renderFieldWithPrivacy(
                  'Telegram',
                  'contact_telegram',
                  'text',
                  false,
                  '',
                  'privacy_contact_telegram'
                )}
              </CardContent>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='socials'>
            <AccordionTrigger>
              <CardHeader className='flex-row items-center p-0'>
                <CardTitle className='flex-1 text-lg font-semibold whitespace-nowrap text-blue-600'>
                  Socials
                </CardTitle>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className='space-y-6 bg-slate-900 p-5'>
                <div className='rounded-md border p-4'>
                  <div className='space-y-2'>
                    <Label>Socials Privacy</Label>
                    <p className='text-sm text-muted-foreground'>
                      Set the privacy for your social links.
                    </p>
                    <PrivacyControls
                      name='privacy_socials'
                      value={formData.privacy_socials || defaultPrivacy}
                      onChange={handleSelectChange}
                    />
                  </div>
                </div>
                {socials.map((social, index) => (
                  <div key={index} className='flex items-end gap-4'>
                    <div className='flex-grow'>
                      <Label>Type</Label>
                      <Select
                        value={social.type}
                        onValueChange={(value) =>
                          handleSocialChange(index, 'type', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                        <SelectContent>
                          {socialTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='flex-grow-[2]'>
                      <Label>URL</Label>
                      <Input
                        value={social.url}
                        onChange={(e) =>
                          handleSocialChange(index, 'url', e.target.value)
                        }
                        placeholder='https://...'
                      />
                    </div>
                    <Button
                      type='button'
                      variant='destructive'
                      onClick={() => removeSocial(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type='button' onClick={addSocial}>
                  Add Social Link
                </Button>
              </CardContent>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='address'>
            <AccordionTrigger>
              <CardHeader className='flex-row items-center p-0'>
                <CardTitle className='flex-1 text-lg font-semibold whitespace-nowrap text-blue-600'>
                  Address
                </CardTitle>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className='space-y-6 bg-slate-900 p-5'>
                <h3 className='font-semibold'>Permanent Address</h3>
                <div className='rounded-md border p-4'>
                  <div className='space-y-2'>
                    <Label>Permanent Address Privacy</Label>
                    <p className='text-sm text-muted-foreground'>
                      Set the privacy for your permanent address.
                    </p>
                    <PrivacyControls
                      name='privacy_permanentAddress'
                      value={
                        formData.privacy_permanentAddress || defaultPrivacy
                      }
                      onChange={handleSelectChange}
                    />
                  </div>
                </div>
                {renderField('House No', 'permanent_houseNo', 'text')}
                {renderField('Street', 'permanent_street', 'text')}
                {renderField('Area', 'permanent_area', 'text')}
                {renderField('Landmark', 'permanent_landmark', 'text')}
                {renderField('Post Office', 'permanent_post_office', 'text')}
                {renderField('District', 'permanent_district', 'text')}
                {renderField('State', 'permanent_state', 'text')}
                {renderField('Country', 'permanent_country', 'text')}
                {renderField('Pincode', 'permanent_pincode', 'text')}

                <h3 className='mt-6 font-semibold'>Current Address</h3>
                <div className='mb-4 flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    id='sameAsPermanent'
                    checked={isSameAsPermanentAddress}
                    onChange={(e) =>
                      handleSameAsPermanentAddressChange(e.target.checked)
                    }
                  />
                  <Label htmlFor='sameAsPermanent'>
                    Same as Permanent Address
                  </Label>
                </div>
                <div className='rounded-md border p-4'>
                  <div className='space-y-2'>
                    <Label>Current Address Privacy</Label>
                    <p className='text-sm text-muted-foreground'>
                      Set the privacy for your current address.
                    </p>
                    <PrivacyControls
                      name='privacy_currentAddress'
                      value={formData.privacy_currentAddress || defaultPrivacy}
                      onChange={handleSelectChange}
                      disabled={isSameAsPermanentAddress}
                    />
                  </div>
                </div>
                {renderField(
                  'House No',
                  'current_houseNo',
                  'text',
                  false,
                  '',
                  isSameAsPermanentAddress
                )}
                {renderField(
                  'Street',
                  'current_street',
                  'text',
                  false,
                  '',
                  isSameAsPermanentAddress
                )}
                {renderField(
                  'Area',
                  'current_area',
                  'text',
                  false,
                  '',
                  isSameAsPermanentAddress
                )}
                {renderField(
                  'Landmark',
                  'current_landmark',
                  'text',
                  false,
                  '',
                  isSameAsPermanentAddress
                )}
                {renderField(
                  'Post Office',
                  'current_post_office',
                  'text',
                  false,
                  '',
                  isSameAsPermanentAddress
                )}
                {renderField(
                  'District',
                  'current_district',
                  'text',
                  false,
                  '',
                  isSameAsPermanentAddress
                )}
                {renderField(
                  'State',
                  'current_state',
                  'text',
                  false,
                  '',
                  isSameAsPermanentAddress
                )}
                {renderField(
                  'Country',
                  'current_country',
                  'text',
                  false,
                  '',
                  isSameAsPermanentAddress
                )}
                {renderField(
                  'Pincode',
                  'current_pincode',
                  'text',
                  false,
                  '',
                  isSameAsPermanentAddress
                )}
              </CardContent>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='hostel-info'>
            <AccordionTrigger>
              <CardHeader className='flex-row items-center p-0'>
                <CardTitle className='flex-1 text-lg font-semibold whitespace-nowrap text-blue-600'>
                  Hostel Information
                </CardTitle>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className='space-y-6 bg-slate-900 p-5'>
                <h3 className='font-semibold'>Hostel History</h3>
                <div className='rounded-md border p-4'>
                  <div className='space-y-2'>
                    <Label>Hostel History Privacy</Label>
                    <p className='text-sm text-muted-foreground'>
                      Set the privacy for your hostel history.
                    </p>
                    <PrivacyControls
                      name='privacy_hostelHistory'
                      value={formData.privacy_hostelHistory || defaultPrivacy}
                      onChange={handleSelectChange}
                    />
                  </div>
                </div>
                {hostelHistory.map((entry, index) => (
                  <div key={index} className='space-y-4 rounded-md border p-4'>
                    <div className='flex items-center justify-between'>
                      <h4 className='text-md font-semibold'>
                        Hostel Entry {index + 1}
                      </h4>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={() => removeHostelHistory(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={entry.type}
                          onValueChange={(value) =>
                            handleHostelHistoryChange(index, 'type', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select type' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='hosteller'>Hosteller</SelectItem>
                            <SelectItem value='dayScholar'>
                              Day Scholar
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`entry-date-${index}`}>
                          Start Date
                        </Label>
                        <Input
                          id={`entry-date-${index}`}
                          value={entry.entry}
                          onChange={(e) =>
                            handleHostelHistoryChange(
                              index,
                              'entry',
                              e.target.value
                            )
                          }
                          type='date'
                        />
                      </div>
                      <div>
                        <Label htmlFor={`exit-date-${index}`}>End Date</Label>
                        <Input
                          id={`exit-date-${index}`}
                          value={entry.exit || ''}
                          onChange={(e) =>
                            handleHostelHistoryChange(
                              index,
                              'exit',
                              e.target.value
                            )
                          }
                          type='date'
                        />
                      </div>
                      <div>
                        <Label htmlFor={`building-${index}`}>Building</Label>
                        <Input
                          id={`building-${index}`}
                          value={entry.building || ''}
                          onChange={(e) =>
                            handleHostelHistoryChange(
                              index,
                              'building',
                              e.target.value
                            )
                          }
                          disabled={entry.type === 'dayScholar'}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`room-${index}`}>Room No.</Label>
                        <Input
                          id={`room-${index}`}
                          value={entry.room || ''}
                          onChange={(e) =>
                            handleHostelHistoryChange(
                              index,
                              'room',
                              e.target.value
                            )
                          }
                          disabled={entry.type === 'dayScholar'}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`bed-${index}`}>Bed</Label>
                        <Input
                          id={`bed-${index}`}
                          value={entry.bed || ''}
                          onChange={(e) =>
                            handleHostelHistoryChange(
                              index,
                              'bed',
                              e.target.value
                            )
                          }
                          disabled={entry.type === 'dayScholar'}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button type='button' onClick={addHostelHistory}>
                  Add Hostel History Entry
                </Button>

                <h3 className='mt-6 font-semibold'>Hostel Memories</h3>
                <div className='rounded-md border p-4'>
                  <div className='space-y-2'>
                    <Label>Hostel Memories Privacy</Label>
                    <p className='text-sm text-muted-foreground'>
                      Set the privacy for your hostel memories.
                    </p>
                    <PrivacyControls
                      name='privacy_hostelMemories'
                      value={formData.privacy_hostelMemories || defaultPrivacy}
                      onChange={handleSelectChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor='hostelMemoriesImages'>
                    Image URLs (comma-separated)
                  </Label>
                  <Textarea
                    id='hostelMemoriesImages'
                    name='hostelMemoriesImages'
                    value={hostelMemories.images.join(', ')}
                    onChange={(e) =>
                      handleHostelMemoriesChange('images', e.target.value)
                    }
                    placeholder='e.g., /memories/img1.jpg, /memories/img2.png'
                  />
                </div>
                <div>
                  <Label htmlFor='hostelMemoriesVideos'>
                    Video URLs (comma-separated)
                  </Label>
                  <Textarea
                    id='hostelMemoriesVideos'
                    name='hostelMemoriesVideos'
                    value={hostelMemories.videos.join(', ')}
                    onChange={(e) =>
                      handleHostelMemoriesChange('videos', e.target.value)
                    }
                    placeholder='e.g., /memories/vid1.mp4, /memories/vid2.mov'
                  />
                </div>
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </>
  );
};
