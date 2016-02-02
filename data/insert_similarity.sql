create or replace function create_sim () returns integer  as $$
declare
	i integer;
	j integer;
begin
	for i in select id from deputes
	loop
		for j in select id from deputes where id<i
		loop
			insert into similarity 
			values (i,j,	(select count(*)
					from votes v1, votes v2 
					where v1.id_depute = i 
						and v2.id_depute = j
						and v1.id_ballot = v2.id_ballot
						and v1.choice = v2.choice));

		end loop; 
	end loop;
	return 1;
end;
$$ LANGUAGE plpgsql;

select create_sim();



