UPDATE inmates
SET 
   first_name = new_inmates_table.first_name,
   last_name = new_inmates_table.last_name,
   facility = new_inmates_table.facility,
   location_sub_1 = new_inmates_table.location_sub_1,
   status = new_inmates_table.status,
   custody_status = new_inmates_table.custody_status,
   security_classification = new_inmates_table.security_classification,
   booking_start_date = TO_DATE(new_inmates_table.booking_start_date,'YYYY-MM-DD'),
   primary_ethnicity = new_inmates_table.primary_ethnicity,
   race = new_inmates_table.race,
   date_of_birth = TO_DATE(new_inmates_table.date_of_birth, 'MM-DD-YYYY'),
   age = new_inmates_table.age,
   country_of_birth = new_inmates_table.country_of_birth,
   citizenship = new_inmates_table.citizenship,
   on_count = new_inmates_table.on_count,
   address = new_inmates_table.address,
   release_type = new_inmates_table.release_type,
   actual_release_date = CASE
                              WHEN new_inmates_table.actual_release_date = '' THEN NULL
                              ELSE TO_DATE(new_inmates_table.actual_release_date, 'MM-DD-YYYY')
                          END,
   sentence_length = new_inmates_table.sentence_length
FROM new_inmates_table
WHERE inmates.inmate_id = new_inmates_table.inmate_id;

--INSERT NEW ADDITIONS
INSERT INTO inmates (
    last_name, first_name, inmate_id, facility, location_sub_1, status, custody_status, security_classification, 
    booking_start_date, gender, primary_ethnicity, race, date_of_birth, age, country_of_birth, citizenship, 
    on_count, address, release_type, actual_release_date, sentence_length
)
SELECT 
    new_inmates_table.last_name, new_inmates_table.first_name, new_inmates_table.inmate_id, 
    new_inmates_table.facility, new_inmates_table.location_sub_1, new_inmates_table.status, 
    new_inmates_table.custody_status, new_inmates_table.security_classification, 
    TO_DATE(new_inmates_table.booking_start_date,'YYYY-MM-DD'), new_inmates_table.gender, new_inmates_table.primary_ethnicity, 
    new_inmates_table.race, 
    TO_DATE(new_inmates_table.date_of_birth, 'MM-DD-YYYY'), 
    new_inmates_table.age, new_inmates_table.country_of_birth, new_inmates_table.citizenship, 
    new_inmates_table.on_count, new_inmates_table.address, new_inmates_table.release_type, 
    CASE
        WHEN new_inmates_table.actual_release_date = '' THEN NULL
        ELSE TO_DATE(new_inmates_table.actual_release_date, 'MM-DD-YYYY')
    END, 
    new_inmates_table.sentence_length  
FROM 
    new_inmates_table
LEFT JOIN 
    inmates ON new_inmates_table.inmate_id = inmates.inmate_id
WHERE 
    inmates.inmate_id IS NULL;
   
--INSERT Todays date in deleted_at column for inmates that no longer exist      
   
UPDATE inmates
SET deleted_at = CURRENT_DATE
WHERE NOT EXISTS (
    SELECT 1
    FROM new_inmates_table
    WHERE new_inmates_table.inmate_id = inmates.inmate_id
); 